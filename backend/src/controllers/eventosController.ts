import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Obtener todos los eventos
export const getEventos = async (_req: Request, res: Response) => {
  try {
    const [eventos] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as categoria,
              loc.ciudad, loc.nombre_sede as lugar, loc.ciudades,
              es.nombre as estado
       FROM Evento e
       JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       LEFT JOIN (
           SELECT f.id_evento, 
                  MAX(s.ciudad) as ciudad, 
                  MAX(s.nombre_sede) as nombre_sede,
                  GROUP_CONCAT(DISTINCT s.ciudad SEPARATOR ', ') as ciudades
           FROM Funciones f
           JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
           JOIN Sede s ON a.id_sede = s.id_sede
           GROUP BY f.id_evento
       ) loc ON e.id_evento = loc.id_evento
       LEFT JOIN Municipio m ON loc.ciudad = m.nombre
       LEFT JOIN Estado es ON m.id_estado = es.id_estado
       ORDER BY e.fecha_inicio ASC`
    );

    console.log(`[API] Eventos encontrados: ${eventos.length}`);
    eventos.forEach((evento: any) => {
      console.log(`  - ${evento.nombre_evento} (Imagen: ${evento.imagen_url ? 'SI' : 'NO'})`);
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Obtener evento por ID
export const getEventoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [eventos] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as categoria, te.descripcion as categoria_desc
       FROM Evento e
       JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       WHERE e.id_evento = ?`,
      [id]
    );

    if (eventos.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Obtener funciones del evento
    const [funciones] = await pool.execute<RowDataPacket[]>(
      `SELECT f.*, a.nombre as auditorio, s.nombre_sede, s.ciudad, s.direccion
       FROM Funciones f
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       JOIN Sede s ON a.id_sede = s.id_sede
       WHERE f.id_evento = ?
       ORDER BY f.fecha, f.hora`,
      [id]
    );

    res.json({
      ...eventos[0],
      funciones
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
};

// Obtener eventos por categoría
export const getEventosByCategoria = async (req: Request, res: Response) => {
  try {
    const { id_tipo } = req.params;

    const [eventos] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as categoria
       FROM Evento e
       JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       WHERE e.id_tipo_evento = ?
       ORDER BY e.fecha_inicio ASC`,
      [id_tipo]
    );

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Obtener eventos populares (próximos 10 eventos)
export const getEventosPopulares = async (_req: Request, res: Response) => {
  try {
    const [eventos] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as categoria
       FROM Evento e
       JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       WHERE e.fecha_inicio >= NOW()
       ORDER BY e.fecha_inicio ASC
       LIMIT 10`
    );

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos populares:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Buscar eventos
export const searchEventos = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    const [eventos] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, te.nombre_tipo as categoria
       FROM Evento e
       JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       WHERE e.nombre_evento LIKE ? OR e.descripcion LIKE ?
       ORDER BY e.fecha_inicio ASC`,
      [`%${q}%`, `%${q}%`]
    );

    res.json(eventos);
  } catch (error) {
    console.error('Error al buscar eventos:', error);
    res.status(500).json({ error: 'Error al buscar eventos' });
  }
};

// Obtener categorías (tipos de evento)
export const getCategorias = async (_req: Request, res: Response) => {
  try {
    const [categorias] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Tipo_Evento WHERE activo = 1'
    );

    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Crear evento - Solo admin
export const createEvento = async (req: Request, res: Response) => {
  try {
    const {
      nombre_evento,
      descripcion,
      imagen_url,
      clasificacion,
      fecha_inicio,
      fecha_fin,
      id_tipo_evento,
      id_empleado
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Evento 
       (nombre_evento, descripcion, imagen_url, clasificacion, fecha_inicio, fecha_fin, id_tipo_evento, id_empleado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_evento, descripcion, imagen_url, clasificacion, fecha_inicio, fecha_fin, id_tipo_evento, id_empleado]
    );

    res.status(201).json({
      message: 'Evento creado exitosamente',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

// Actualizar evento - Solo admin
export const updateEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre_evento,
      descripcion,
      imagen_url,
      clasificacion,
      fecha_inicio,
      fecha_fin,
      id_tipo_evento
    } = req.body;

    await pool.execute(
      `UPDATE Evento 
       SET nombre_evento = ?, descripcion = ?, imagen_url = ?, 
           clasificacion = ?, fecha_inicio = ?, fecha_fin = ?, id_tipo_evento = ?
       WHERE id_evento = ?`,
      [nombre_evento, descripcion, imagen_url, clasificacion, fecha_inicio, fecha_fin, id_tipo_evento, id]
    );

    res.json({ message: 'Evento actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};

// Eliminar evento - Solo admin
export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM Evento WHERE id_evento = ?', [id]);

    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};
