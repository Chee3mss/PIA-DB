import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Obtener todos los auditorios
export const getAuditorios = async (_req: Request, res: Response) => {
  try {
    const [auditorios] = await pool.execute<RowDataPacket[]>(
      `SELECT a.*, s.nombre_sede, s.ciudad
       FROM Auditorio a
       JOIN Sede s ON a.id_sede = s.id_sede
       WHERE a.activo = 1
       ORDER BY s.nombre_sede, a.nombre`
    );

    res.json(auditorios);
  } catch (error) {
    console.error('Error al obtener auditorios:', error);
    res.status(500).json({ error: 'Error al obtener auditorios' });
  }
};

// Obtener auditorio por ID
export const getAuditorioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [auditorios] = await pool.execute<RowDataPacket[]>(
      `SELECT a.*, s.nombre_sede, s.ciudad, s.direccion
       FROM Auditorio a
       JOIN Sede s ON a.id_sede = s.id_sede
       WHERE a.id_auditorio = ?`,
      [id]
    );

    if (auditorios.length === 0) {
      return res.status(404).json({ error: 'Auditorio no encontrado' });
    }

    res.json(auditorios[0]);
  } catch (error) {
    console.error('Error al obtener auditorio:', error);
    res.status(500).json({ error: 'Error al obtener auditorio' });
  }
};

// Obtener configuración de Seats.io para una función
export const getSeatsioConfigByFuncion = async (req: Request, res: Response) => {
  try {
    const { id_funcion } = req.params;

    const [result] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        a.seatsio_event_key,
        a.seatsio_public_key,
        a.id_auditorio,
        a.nombre as auditorio_nombre,
        s.nombre_sede,
        f.id_funcion,
        f.fecha,
        f.hora
       FROM Funciones f
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       JOIN Sede s ON a.id_sede = s.id_sede
       WHERE f.id_funcion = ?`,
      [id_funcion]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Función no encontrada' });
    }

    const config = result[0];

    // Verificar que el auditorio tenga configuración de Seats.io
    if (!config.seatsio_event_key) {
      return res.status(404).json({ 
        error: 'Este auditorio no tiene configuración de Seats.io',
        auditorio: config.auditorio_nombre
      });
    }

    res.json({
      seatsio_event_key: config.seatsio_event_key,
      seatsio_public_key: config.seatsio_public_key,
      auditorio: {
        id: config.id_auditorio,
        nombre: config.auditorio_nombre,
        sede: config.nombre_sede
      },
      funcion: {
        id: config.id_funcion,
        fecha: config.fecha,
        hora: config.hora
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración de Seats.io:', error);
    res.status(500).json({ error: 'Error al obtener configuración de Seats.io' });
  }
};

// Actualizar configuración de Seats.io de un auditorio - Solo admin
export const updateSeatsioConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatsio_event_key, seatsio_public_key } = req.body;

    // Validar que al menos uno de los campos esté presente
    if (!seatsio_event_key && !seatsio_public_key) {
      return res.status(400).json({ 
        error: 'Debe proporcionar al menos seatsio_event_key o seatsio_public_key' 
      });
    }

    // Construir la query dinámicamente según los campos proporcionados
    let query = 'UPDATE Auditorio SET ';
    const params: any[] = [];

    if (seatsio_event_key !== undefined) {
      query += 'seatsio_event_key = ?';
      params.push(seatsio_event_key);
    }

    if (seatsio_public_key !== undefined) {
      if (params.length > 0) query += ', ';
      query += 'seatsio_public_key = ?';
      params.push(seatsio_public_key);
    }

    query += ' WHERE id_auditorio = ?';
    params.push(id);

    await pool.execute(query, params);

    res.json({ 
      message: 'Configuración de Seats.io actualizada exitosamente',
      auditorio_id: id
    });
  } catch (error) {
    console.error('Error al actualizar configuración de Seats.io:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};

// Crear auditorio - Solo admin
export const createAuditorio = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      capacidad,
      id_sede,
      seatsio_event_key,
      seatsio_public_key
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Auditorio 
       (nombre, capacidad, id_sede, seatsio_event_key, seatsio_public_key, activo)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [nombre, capacidad, id_sede, seatsio_event_key || null, seatsio_public_key || null]
    );

    res.status(201).json({
      message: 'Auditorio creado exitosamente',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Error al crear auditorio:', error);
    res.status(500).json({ error: 'Error al crear auditorio' });
  }
};

// Actualizar auditorio - Solo admin
export const updateAuditorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      capacidad,
      id_sede,
      seatsio_event_key,
      seatsio_public_key,
      activo
    } = req.body;

    await pool.execute(
      `UPDATE Auditorio 
       SET nombre = ?, capacidad = ?, id_sede = ?, 
           seatsio_event_key = ?, seatsio_public_key = ?, activo = ?
       WHERE id_auditorio = ?`,
      [nombre, capacidad, id_sede, seatsio_event_key, seatsio_public_key, activo, id]
    );

    res.json({ message: 'Auditorio actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar auditorio:', error);
    res.status(500).json({ error: 'Error al actualizar auditorio' });
  }
};

// Eliminar auditorio (soft delete) - Solo admin
export const deleteAuditorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE Auditorio SET activo = 0 WHERE id_auditorio = ?',
      [id]
    );

    res.json({ message: 'Auditorio desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar auditorio:', error);
    res.status(500).json({ error: 'Error al eliminar auditorio' });
  }
};

// Obtener sedes (para seleccionar al crear/editar auditorio)
export const getSedes = async (_req: Request, res: Response) => {
  try {
    const [sedes] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Sede WHERE activo = 1 ORDER BY nombre_sede'
    );

    res.json(sedes);
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    res.status(500).json({ error: 'Error al obtener sedes' });
  }
};

