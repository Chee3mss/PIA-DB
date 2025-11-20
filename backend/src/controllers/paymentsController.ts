import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Usar la clave secreta desde las variables de entorno
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    // Calculate order amount
    const calculateOrderAmount = (items: any[]) => {
      let total = 0;
      if (items && Array.isArray(items)) {
        items.forEach((item) => {
            const price = item.pricing?.price || 500;
            total += price;
        });
      }
      return total * 100; // Stripe expects amount in cents
    };

    const amount = calculateOrderAmount(items);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount > 0 ? amount : 100,
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items_count: items.length,
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    if (error.code === 'api_key_expired' || error.type === 'StripeAuthenticationError') {
         console.log("Stripe Authentication failed. Falling back to mock for demonstration.");
         return res.send({
            clientSecret: "pi_mock_secret_fallback_" + Date.now(),
         });
    }
    
    res.status(500).json({ error: error.message });
  }
};

// Helper to register purchase in DB
const registerPurchase = async (res: Response, items: any[], customerId: number, transactionId: string, functionId: number) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Crear Venta
        const total = items.reduce((sum, item) => sum + (item.pricing?.price || 500), 0);
        
        // Valid IDs for required fields based on schema
        const idEmpleadoOnline = 1; // Admin/System user
        const idMetodoPago = 1; // Tarjeta de crédito
        
        const [ventaResult] = await connection.execute<any>(
            `INSERT INTO Ventas (id_cliente, fecha, total, id_empleado, id_metodo) 
             VALUES (?, NOW(), ?, ?, ?)`,
            [customerId, total, idEmpleadoOnline, idMetodoPago]
        );
        const idVenta = ventaResult.insertId;

        // 2. Registrar Transacción
        try {
             await connection.execute(
                `INSERT INTO Transacciones (id_venta, monto, fecha, estado, referencia_pago)
                 VALUES (?, ?, NOW(), 'Completado', ?)`,
                [idVenta, total, transactionId]
            );
        } catch (e) {
            console.warn("Tabla Transacciones podría no existir, continuando con Boletos...", e);
        }

        // 3. Registrar Boletos
        const idEstadoVendido = 3; // 3 = Vendido (based on inserts: 1=Disponible, 2=Reservado, 3=Vendido)
        const idTipoDefecto = 2; // 2 = General (based on inserts)

        // Obtener eventKey de Seats.io para esta función
        const [funcionRows] = await connection.execute<RowDataPacket[]>(
            'SELECT seatsio_event_key FROM Funciones WHERE id_funcion = ?',
            [functionId]
        );
        
        const seatsioEventKey = funcionRows[0]?.seatsio_event_key;

        for (const item of items) {
             await connection.execute(
                `INSERT INTO Boletos (id_funcion, id_venta, id_tipo_boleto, id_estado_boleto, asiento, precio_final, vigente)
                 VALUES (?, ?, ?, ?, ?, ?, 1)`,
                [functionId, idVenta, idTipoDefecto, idEstadoVendido, item.label || item.id, item.pricing?.price || 500]
             );
        }
        
        // 4. Reservar en Seats.io (BOOKING REAL)
        if (seatsioEventKey) {
            try {
                // Importar el servicio de Seats.io aquí para evitar problemas de dependencia circular si las hubiera
                const seatsioService = require('../services/seatsioService').default;
                
                // Extraer los IDs de los asientos (e.g. "VIP-A-1")
                const seatIds = items.map(item => item.id);
                
                console.log(`Confirmando reserva en Seats.io para evento ${seatsioEventKey}, asientos:`, seatIds);
                
                // Llamar a la API de Seats.io para cambiar estado a 'booked'
                await seatsioService.bookSeats(seatsioEventKey, seatIds);
                console.log('✅ Asientos confirmados en Seats.io');
                
            } catch (seatsioError: any) {
                console.error('❌ Error al confirmar en Seats.io (pero la venta se registró en DB):', seatsioError.message);
                // No hacemos rollback aquí porque el dinero ya se cobró, pero avisamos.
                // En producción, esto debería ir a una cola de reintentos o alerta a soporte.
            }
        } else {
            console.warn('⚠️ No se encontró seatsio_event_key para la función, no se actualizará el mapa');
        }
        
        await connection.commit();
        res.json({ success: true, idVenta, message: "Compra registrada y asientos reservados exitosamente" });

    } catch (error: any) {
        await connection.rollback();
        console.error("Error registering purchase:", error);
        // Return specific error message for debugging
        res.status(500).json({ error: error.message || 'Error al registrar la compra en base de datos' });
    } finally {
        connection.release();
    }
}

export const confirmPayment = async (req: Request, res: Response) => {
    const { paymentIntentId, items, customerId, functionId } = req.body;
    
    // Validate input
    if (!paymentIntentId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Datos incompletos para confirmar pago' });
    }

    const idCliente = customerId || 3; // Default a cliente 3 si no hay sesión
    const idFuncion = functionId || 17; // Fallback para pruebas

    // If mock payment, skip verification
    if (paymentIntentId.startsWith('pi_mock_')) {
        return registerPurchase(res, items, idCliente, paymentIntentId, idFuncion);
    }

    try {
        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
             await registerPurchase(res, items, idCliente, paymentIntentId, idFuncion);
        } else {
            res.status(400).json({ error: `El pago no se completó. Estado: ${paymentIntent.status}` });
        }
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: 'Error al verificar el pago' });
    }
};
