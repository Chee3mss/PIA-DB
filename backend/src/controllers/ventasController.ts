import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Obtener todas las ventas (solo para administradores)
export const getAllVentas = async (req: Request, res: Response) => {
  try {
    const [ventas] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        v.id_venta,
        v.fecha,
        v.total,
        v.impuestos,
        c.nombre_completo as nombre_cliente,
        c.email as email_cliente,
        mp.nombre_metodo,
        COUNT(b.id_boleto) as cantidad_boletos
      FROM Ventas v
      INNER JOIN Clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
      LEFT JOIN Boletos b ON v.id_venta = b.id_venta
      GROUP BY v.id_venta
      ORDER BY v.fecha DESC`
    );

    res.json({
      success: true,
      data: ventas
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener las ventas' 
    });
  }
};

// Obtener detalles de una venta específica
export const getVentaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [ventas] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        v.*,
        c.nombre_completo as nombre_cliente,
        c.email as email_cliente,
        c.telefono as telefono_cliente,
        mp.nombre_metodo,
        e.nombre as nombre_empleado,
        e.apellido as apellido_empleado,
        p.nombre_promocion,
        p.descuento
      FROM Ventas v
      INNER JOIN Clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
      INNER JOIN Empleado e ON v.id_empleado = e.id_empleado
      LEFT JOIN Promociones p ON v.id_promocion = p.id_promocion
      WHERE v.id_venta = ?`,
      [id]
    );

    if (ventas.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Venta no encontrada'
      });
    }

    // Obtener los boletos de esta venta
    const [boletos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        b.*,
        tb.nombre_tipo,
        tb.precio_base,
        f.fecha as fecha_funcion,
        f.hora as hora_funcion,
        ev.nombre_evento,
        a.nombre as nombre_auditorio,
        s.nombre_sede,
        z.nombre_zona
      FROM Boletos b
      INNER JOIN Tipo_Boleto tb ON b.id_tipo_boleto = tb.id_tipo_boleto
      INNER JOIN Funciones f ON b.id_funcion = f.id_funcion
      INNER JOIN Evento ev ON f.id_evento = ev.id_evento
      INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
      INNER JOIN Sede s ON a.id_sede = s.id_sede
      INNER JOIN Zonas z ON tb.id_zona = z.id_zona
      WHERE b.id_venta = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        venta: ventas[0],
        boletos: boletos
      }
    });
  } catch (error) {
    console.error('Error al obtener detalles de venta:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener los detalles de la venta' 
    });
  }
};

// Obtener estadísticas de ventas
export const getVentasStats = async (req: Request, res: Response) => {
  try {
    // Total de ventas
    const [totalVentas] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total, SUM(total) as monto_total FROM Ventas'
    );

    // Ventas por mes (últimos 6 meses)
    const [ventasPorMes] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as mes,
        COUNT(*) as cantidad,
        SUM(total) as monto
      FROM Ventas
      WHERE fecha >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes DESC`
    );

    // Método de pago más usado
    const [metodosPago] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        mp.nombre_metodo,
        COUNT(*) as cantidad,
        SUM(v.total) as monto_total
      FROM Ventas v
      INNER JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
      GROUP BY mp.id_metodo
      ORDER BY cantidad DESC`
    );

    res.json({
      success: true,
      data: {
        total_ventas: totalVentas[0].total,
        monto_total: totalVentas[0].monto_total,
        ventas_por_mes: ventasPorMes,
        metodos_pago: metodosPago
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener estadísticas' 
    });
  }
};

