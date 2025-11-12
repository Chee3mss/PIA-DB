import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Registrar nuevo cliente
export const registerCliente = async (req: Request, res: Response) => {
  try {
    const { nombre_completo, email, password, telefono, id_municipio } = req.body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !password || !id_municipio) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id_cliente FROM Clientes WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Generar número de registro único
    const numero_registro = `CLI-${Date.now()}`;

    // Insertar nuevo cliente
    const [result] = await pool.execute(
      `INSERT INTO Clientes (nombre_completo, email, password_hash, telefono, numero_registro, id_municipio) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_completo, email, password_hash, telefono, numero_registro, id_municipio]
    );

    res.status(201).json({ 
      message: 'Cliente registrado exitosamente',
      numero_registro 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

// Login de cliente
export const loginCliente = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar cliente
    const [clientes] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Clientes WHERE email = ?',
      [email]
    );

    if (clientes.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const cliente = clientes[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, cliente.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: cliente.id_cliente, 
        email: cliente.email,
        tipo: 'cliente'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: cliente.id_cliente,
        nombre: cliente.nombre_completo,
        email: cliente.email,
        tipo: 'cliente'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Login de empleado/admin
export const loginEmpleado = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar empleado con su tipo
    const [empleados] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as rol 
       FROM Empleado e
       JOIN Tipo_Empleado te ON e.id_tipo_empleado = te.id_tipo_empleado
       WHERE e.email = ? AND e.id_estado_empleado = 1`,
      [email]
    );

    if (empleados.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const empleado = empleados[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, empleado.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: empleado.id_empleado, 
        email: empleado.email,
        tipo: 'empleado',
        rol: empleado.rol,
        id_tipo_empleado: empleado.id_tipo_empleado
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: empleado.id_empleado,
        nombre: `${empleado.nombre} ${empleado.apellido}`,
        email: empleado.email,
        tipo: 'empleado',
        rol: empleado.rol
      }
    });
  } catch (error) {
    console.error('Error en login empleado:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Verificar token
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    res.json({
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        tipo: decoded.tipo,
        rol: decoded.rol
      }
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false,
      error: 'Token inválido' 
    });
  }
};

