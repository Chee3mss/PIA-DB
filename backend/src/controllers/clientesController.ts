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

// Obtener compras del cliente
export const getComprasCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const compras = await query(
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

    res.json({
      success: true,
      data: compras
    });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener compras del cliente'
    });
  }
};

