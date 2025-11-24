import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { Cliente, ClienteRegistro, ClienteLogin, ApiResponse } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Registrar un nuevo cliente
export const registrarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre_completo, email, password, telefono, id_municipio }: ClienteRegistro = req.body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !password || !id_municipio) {
      res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
      return;
    }

    // Verificar si el email ya existe
    const existingCliente = await query<RowDataPacket[]>(
      'SELECT id_cliente FROM Clientes WHERE email = ?',
      [email]
    );

    if (existingCliente.length > 0) {
      res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
      return;
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generar número de registro único
    const numero_registro = `CLI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Insertar cliente
    const result = await query<ResultSetHeader>(
      `INSERT INTO Clientes (nombre_completo, email, password_hash, telefono, numero_registro, id_municipio)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_completo, email, password_hash, telefono || null, numero_registro, id_municipio]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId, email, tipo: 'cliente' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Cliente registrado exitosamente',
      data: {
        id_cliente: result.insertId,
        nombre_completo,
        email,
        numero_registro,
        token
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar cliente'
    });
  }
};

// Login de cliente
export const loginCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: ClienteLogin = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
      return;
    }

    // Buscar cliente
    const clientes = await query<(RowDataPacket & Cliente)[]>(
      'SELECT * FROM Clientes WHERE email = ?',
      [email]
    );

    if (clientes.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
      return;
    }

    const cliente = clientes[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, cliente.password_hash);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: cliente.id_cliente, email: cliente.email, tipo: 'cliente' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Login exitoso',
      data: {
        id_cliente: cliente.id_cliente,
        nombre_completo: cliente.nombre_completo,
        email: cliente.email,
        telefono: cliente.telefono,
        numero_registro: cliente.numero_registro,
        token
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    });
  }
};

// Obtener perfil del cliente
export const getPerfilCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const clientes = await query<RowDataPacket[]>(
      `SELECT c.id_cliente, c.nombre_completo, c.email, c.telefono, c.numero_registro, 
              c.fecha_registro, m.nombre as municipio, e.nombre as estado
       FROM Clientes c
       LEFT JOIN Municipio m ON c.id_municipio = m.id_municipio
       LEFT JOIN Estado e ON m.id_estado = e.id_estado
       WHERE c.id_cliente = ?`,
      [id]
    );

    if (clientes.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: clientes[0]
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil del cliente'
    });
  }
};

// Actualizar perfil del cliente
export const updatePerfilCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, telefono } = req.body;
    // Validar que al menos un campo se esté actualizando
    if (nombre_completo === undefined && email === undefined && telefono === undefined) {
      res.status(400).json({
        success: false,
        error: 'Debes proporcionar al menos un campo para actualizar'
      });
      return;
    }

    // Verificar que el cliente existe
    const clientId = parseInt(id as string, 10);
    if (isNaN(clientId)) {
      res.status(400).json({ success: false, error: 'ID de cliente inválido' });
      return;
    }

    const existing = await query<RowDataPacket[]>(
      'SELECT id_cliente FROM Clientes WHERE id_cliente = ?',
      [clientId]
    );

    if (!existing || existing.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
      return;
    }

    // Si se intenta cambiar el email, verificar que no esté en uso
    if (email) {
      const emailExists = await query<RowDataPacket[]>(
        'SELECT id_cliente FROM Clientes WHERE email = ? AND id_cliente != ?',
        [email, clientId]
      );
      
      if (emailExists && emailExists.length > 0) {
        res.status(400).json({
          success: false,
          error: 'El email ya está registrado por otro usuario'
        });
        return;
      }
    }

    // Construir query de actualización dinámicamente
    const updates: string[] = [];
    const values: any[] = [];

    if (nombre_completo) {
      updates.push('nombre_completo = ?');
      values.push(nombre_completo);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (telefono !== undefined) {
      updates.push('telefono = ?');
      values.push(telefono || null);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No hay campos para actualizar'
      });
      return;
    }

    values.push(clientId);

    await query(
      `UPDATE Clientes SET ${updates.join(', ')} WHERE id_cliente = ?`,
      values
    );

    // Obtener el perfil actualizado
    const updated = await query<RowDataPacket[]>(
      `SELECT c.id_cliente, c.nombre_completo, c.email, c.telefono, c.numero_registro, 
              c.fecha_registro, m.nombre as municipio, e.nombre as estado
       FROM Clientes c
       LEFT JOIN Municipio m ON c.id_municipio = m.id_municipio
       LEFT JOIN Estado e ON m.id_estado = e.id_estado
       WHERE c.id_cliente = ?`,
      [clientId]
    );
    if (!updated || updated.length === 0) {
      res.status(500).json({ success: false, error: 'No se pudo recuperar el perfil actualizado' });
      return;
    }

    res.json({
      success: true,
      data: updated[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    // En entorno de desarrollo devolver el mensaje de error para facilitar debugging
    const isProd = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      error: isProd ? 'Error al actualizar perfil del cliente' : (error as Error).message
    });
  }
};

// Obtener compras del cliente
export const getComprasCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Obtener las ventas del cliente
    const ventas = await query(
      `SELECT v.*, mp.nombre_metodo, 
              COUNT(b.id_boleto) as cantidad_boletos
       FROM Ventas v
       LEFT JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
       LEFT JOIN Boletos b ON b.id_venta = v.id_venta
       WHERE v.id_cliente = ?
       GROUP BY v.id_venta
       ORDER BY v.fecha DESC`,
      [id]
    );

    // Para cada venta, obtener los detalles de los boletos
    const comprasConDetalles = await Promise.all(
      ventas.map(async (venta: any) => {
        const boletos = await query(
          `SELECT 
            b.id_boleto,
            b.asiento,
            b.precio_final,
            b.vigente,
            tb.nombre_tipo as tipo_boleto,
            eb.nombre as estado_boleto,
            e.nombre_evento,
            e.descripcion as descripcion_evento,
            e.imagen_url,
            f.fecha as fecha_funcion,
            f.hora as hora_funcion,
            f.id_funcion,
            a.nombre as nombre_auditorio,
            s.nombre_sede as nombre_lugar,
            s.direccion as direccion_lugar,
            s.ciudad,
            est.nombre as estado_lugar
          FROM Boletos b
          LEFT JOIN Tipo_Boleto tb ON b.id_tipo_boleto = tb.id_tipo_boleto
          LEFT JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
          LEFT JOIN Funciones f ON b.id_funcion = f.id_funcion
          LEFT JOIN Evento e ON f.id_evento = e.id_evento
          LEFT JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
          LEFT JOIN Sede s ON a.id_sede = s.id_sede
          LEFT JOIN Municipio m ON s.ciudad = m.nombre
          LEFT JOIN Estado est ON m.id_estado = est.id_estado
          WHERE b.id_venta = ?
          ORDER BY b.asiento`,
          [venta.id_venta]
        );

        return {
          ...venta,
          boletos
        };
      })
    );

    res.json({
      success: true,
      data: comprasConDetalles
    });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener compras del cliente'
    });
  }
};

// Obtener todos los clientes (solo para administradores)
export const getAllClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await query<RowDataPacket[]>(
      `SELECT c.id_cliente, c.nombre_completo, c.email, c.telefono, c.numero_registro, 
              c.fecha_registro, m.nombre as municipio, e.nombre as estado,
              COUNT(DISTINCT v.id_venta) as total_compras,
              SUM(v.total) as monto_total_compras
       FROM Clientes c
       LEFT JOIN Municipio m ON c.id_municipio = m.id_municipio
       LEFT JOIN Estado e ON m.id_estado = e.id_estado
       LEFT JOIN Ventas v ON c.id_cliente = v.id_cliente
       GROUP BY c.id_cliente
       ORDER BY c.fecha_registro DESC`
    );

    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener clientes'
    });
  }
};

