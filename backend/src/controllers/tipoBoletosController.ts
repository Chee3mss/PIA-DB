import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Obtener todos los tipos de boleto
export const getAllTipoBoletos = async (req: Request, res: Response) => {
  try {
    const [tipoBoletos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        tb.id_tipo_boleto,
        tb.nombre_tipo,
        tb.descripcion,
        tb.precio_base,
        tb.activo,
        tb.id_zona,
        z.nombre_zona,
        z.descripcion as zona_descripcion,
        a.nombre as auditorio_nombre,
        a.id_auditorio,
        s.nombre_sede
      FROM Tipo_Boleto tb
      LEFT JOIN Zonas z ON tb.id_zona = z.id_zona
      LEFT JOIN Auditorio a ON z.id_auditorio = a.id_auditorio
      LEFT JOIN Sede s ON a.id_sede = s.id_sede
      ORDER BY s.nombre_sede, a.nombre, tb.nombre_tipo`
    );

    res.json(tipoBoletos);
  } catch (error) {
    console.error('Error al obtener tipos de boleto:', error);
    res.status(500).json({ error: 'Error al obtener tipos de boleto' });
  }
};

// Obtener tipos de boleto por auditorio
export const getTipoBoletosbyAuditorio = async (req: Request, res: Response) => {
  try {
    const { id_auditorio } = req.params;

    const [tipoBoletos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        tb.id_tipo_boleto,
        tb.nombre_tipo,
        tb.descripcion,
        tb.precio_base,
        tb.activo,
        tb.id_zona,
        z.nombre_zona,
        z.descripcion as zona_descripcion,
        z.capacidad as zona_capacidad
      FROM Tipo_Boleto tb
      JOIN Zonas z ON tb.id_zona = z.id_zona
      WHERE z.id_auditorio = ?
      ORDER BY tb.precio_base DESC`,
      [id_auditorio]
    );

    res.json(tipoBoletos);
  } catch (error) {
    console.error('Error al obtener tipos de boleto:', error);
    res.status(500).json({ error: 'Error al obtener tipos de boleto' });
  }
};

// Actualizar precio de tipo de boleto
export const updateTipoBoletoPrecio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { precio_base } = req.body;

    if (precio_base === undefined || precio_base < 0) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE Tipo_Boleto SET precio_base = ? WHERE id_tipo_boleto = ?',
      [precio_base, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tipo de boleto no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Precio actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar precio:', error);
    res.status(500).json({ error: 'Error al actualizar precio' });
  }
};

// Actualizar tipo de boleto completo
export const updateTipoBoleto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_tipo, descripcion, precio_base, activo } = req.body;

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE Tipo_Boleto 
       SET nombre_tipo = ?, descripcion = ?, precio_base = ?, activo = ?
       WHERE id_tipo_boleto = ?`,
      [nombre_tipo, descripcion, precio_base, activo ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tipo de boleto no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Tipo de boleto actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar tipo de boleto:', error);
    res.status(500).json({ error: 'Error al actualizar tipo de boleto' });
  }
};

// Crear tipo de boleto
export const createTipoBoleto = async (req: Request, res: Response) => {
  try {
    const { nombre_tipo, descripcion, precio_base, id_zona } = req.body;

    if (!nombre_tipo || !precio_base || !id_zona) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: nombre_tipo, precio_base, id_zona' 
      });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO Tipo_Boleto (nombre_tipo, descripcion, precio_base, activo, id_zona)
       VALUES (?, ?, ?, 1, ?)`,
      [nombre_tipo, descripcion || '', precio_base, id_zona]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Tipo de boleto creado correctamente',
      id_tipo_boleto: result.insertId
    });
  } catch (error) {
    console.error('Error al crear tipo de boleto:', error);
    res.status(500).json({ error: 'Error al crear tipo de boleto' });
  }
};

// Eliminar (desactivar) tipo de boleto
export const deleteTipoBoleto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - desactivar en lugar de eliminar
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE Tipo_Boleto SET activo = 0 WHERE id_tipo_boleto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tipo de boleto no encontrado' });
    }

    res.json({ 
      success: true, 
      message: 'Tipo de boleto desactivado correctamente' 
    });
  } catch (error) {
    console.error('Error al desactivar tipo de boleto:', error);
    res.status(500).json({ error: 'Error al desactivar tipo de boleto' });
  }
};

