import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Registrar nuevo cliente
export const registerCliente = async (req: Request, res: Response) => {
  try {
    const { nombre_completo, email, password } = req.body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre completo, email y contraseña son requeridos' 
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

    // Insertar nuevo cliente con valores por defecto o NULL para campos opcionales
    // id_municipio: 19039 = Monterrey, Nuevo León (valor por defecto)
    const [result]: any = await pool.execute(
      `INSERT INTO Clientes (nombre_completo, email, password_hash, numero_registro, id_municipio) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_completo, email, password_hash, numero_registro, 19039]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        tipo: 'cliente'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Cliente registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        id_cliente: result.insertId,
        nombre_completo: nombre_completo,
        email: email,
        numero_registro,
        tipo: 'cliente'
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
};

// Registrar nuevo empleado/admin
export const registerEmpleado = async (req: Request, res: Response) => {
  try {
    const { nombre_completo, email, password } = req.body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre completo, email y contraseña son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id_empleado FROM Empleado WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Separar nombre y apellido (tomar el último como apellido)
    const partes = nombre_completo.trim().split(' ');
    const apellido = partes.length > 1 ? partes.pop() : '';
    const nombre = partes.join(' ') || nombre_completo;

    // Insertar nuevo empleado
    // id_tipo_empleado: 3 = Administrador, id_estado_empleado: 1 = Activo
    const [result]: any = await pool.execute(
      `INSERT INTO Empleado (nombre, apellido, email, password_hash, telefono, salario, id_estado_empleado, id_tipo_empleado) 
       VALUES (?, ?, ?, ?, NULL, 0.00, 1, 3)`,
      [nombre, apellido, email, password_hash]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: result.insertId, 
        email: email,
        tipo: 'empleado',
        rol: 'Administrador',
        id_tipo_empleado: 3
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Administrador registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        id_empleado: result.insertId,
        nombre_completo: nombre_completo,
        email: email,
        tipo: 'empleado',
        rol: 'Administrador'
      }
    });
  } catch (error) {
    console.error('Error en registro de empleado:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
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
        id_cliente: cliente.id_cliente,
        nombre_completo: cliente.nombre_completo,
        email: cliente.email,
        telefono: cliente.telefono,
        numero_registro: cliente.numero_registro,
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

// Login unificado - Busca tanto en clientes como en empleados
export const loginUnificado = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Primero buscar en clientes
    const [clientes] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Clientes WHERE email = ?',
      [email]
    );

    if (clientes.length > 0) {
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

      return res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: cliente.id_cliente,
          id_cliente: cliente.id_cliente,
          nombre_completo: cliente.nombre_completo,
          email: cliente.email,
          telefono: cliente.telefono,
          numero_registro: cliente.numero_registro,
          tipo: 'cliente'
        }
      });
    }

    // Si no es cliente, buscar en empleados
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
        nombre_completo: `${empleado.nombre} ${empleado.apellido}`,
        email: empleado.email,
        tipo: 'empleado',
        rol: empleado.rol,
        id_tipo_empleado: empleado.id_tipo_empleado
      }
    });
  } catch (error) {
    console.error('Error en login unificado:', error);
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

