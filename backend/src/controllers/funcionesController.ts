import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import seatsioService from '../services/seatsioService';

export const crearFuncion = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { id_evento, id_auditorio, fecha_hora } = req.body;

    if (!id_evento || !id_auditorio || !fecha_hora) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: id_evento, id_auditorio, fecha_hora'
      });
      return;
    }

    // Separar fecha y hora del formato ISO
    const dateTime = new Date(fecha_hora);
    const fecha = dateTime.toISOString().split('T')[0];
    const hora = dateTime.toISOString().split('T')[1].substring(0, 8);

    await connection.beginTransaction();

    // Obtener información del auditorio para vincular con Seats.io
    const [auditorios] = await connection.query<RowDataPacket[]>(
      'SELECT seatsio_event_key FROM Auditorio WHERE id_auditorio = ?',
      [id_auditorio]
    );

    if (auditorios.length === 0) {
      await connection.rollback();
      res.status(404).json({
        success: false,
        message: 'Auditorio no encontrado'
      });
      return;
    }

    const auditorio = auditorios[0];
    let seatsioEventId = null;

    // Si el auditorio tiene configuración de Seats.io, crear evento automáticamente
    if (auditorio.seatsio_event_key && process.env.SEATSIO_SECRET_KEY) {
      try {
        // Crear el evento en Seats.io con información de la función
        const fechaHora = new Date(`${fecha}T${hora}`);
        const seatsioEvent = await seatsioService.createEvent({
          chartKey: auditorio.seatsio_event_key,
          eventName: `Función ${fechaHora.toLocaleString('es-MX')}`,
          date: fecha
        });
        seatsioEventId = seatsioEvent.key;
        console.log(`✅ Evento de Seats.io creado automáticamente: ${seatsioEventId}`);
      } catch (error) {
        console.warn('⚠️  No se pudo crear evento en Seats.io. Continuando sin integración.', 
          error instanceof Error ? error.message : 'Error desconocido');
        // No detenemos la creación de la función si falla Seats.io
        seatsioEventId = null;
      }
    } else if (auditorio.seatsio_event_key && !process.env.SEATSIO_SECRET_KEY) {
      console.warn('⚠️  Seats.io no está configurado. La función se creará sin integración de asientos.');
    }

    // Crear la función en la base de datos
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO Funciones (id_evento, id_auditorio, fecha, hora, seatsio_event_key)
       VALUES (?, ?, ?, ?, ?)`,
      [id_evento, id_auditorio, fecha, hora, seatsioEventId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Función creada exitosamente',
      data: {
        id_funcion: result.insertId,
        seatsio_event_key: seatsioEventId
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear función:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la función',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    connection.release();
  }
};

export const eliminarFuncion = async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID de función no proporcionado'
      });
      return;
    }

    await connection.beginTransaction();

    // Verificar si hay boletos vendidos para esta función
    const [boletos] = await connection.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM Boletos WHERE id_funcion = ?',
      [id]
    );

    if (boletos[0].count > 0) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        message: 'No se puede eliminar la función porque tiene boletos vendidos'
      });
      return;
    }

    // Obtener el seatsio_event_key antes de eliminar
    const [funciones] = await connection.query<RowDataPacket[]>(
      'SELECT seatsio_event_key FROM Funciones WHERE id_funcion = ?',
      [id]
    );

    // Eliminar la función
    const [result] = await connection.query<ResultSetHeader>(
      'DELETE FROM Funciones WHERE id_funcion = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      res.status(404).json({
        success: false,
        message: 'Función no encontrada'
      });
      return;
    }

    // TODO: Opcionalmente eliminar el evento de Seats.io si existe
    // (requiere implementar método deleteEvent en seatsioService)

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Función eliminada exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar función:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la función',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    connection.release();
  }
};

export const obtenerFuncionesPorEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_evento } = req.params;

    const [funciones] = await pool.query<RowDataPacket[]>(
      `SELECT 
        f.id_funcion,
        f.fecha,
        f.hora,
        f.seatsio_event_key,
        a.id_auditorio,
        a.nombre as nombre_auditorio,
        a.capacidad as capacidad_total,
        s.nombre_sede as nombre_sede,
        s.direccion as direccion_sede
      FROM Funciones f
      INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
      INNER JOIN Sede s ON a.id_sede = s.id_sede
      WHERE f.id_evento = ?
      ORDER BY f.fecha ASC, f.hora ASC`,
      [id_evento]
    );

    // Combinar fecha y hora en formato ISO para el frontend
    const funcionesFormateadas = funciones.map(f => {
      // Formatear fecha (YYYY-MM-DD)
      const fechaObj = new Date(f.fecha);
      const fecha = fechaObj.toISOString().split('T')[0];
      
      // Formatear hora (HH:MM:SS)
      const hora = typeof f.hora === 'string' ? f.hora : f.hora.toString();
      
      return {
        ...f,
        fecha_hora: `${fecha}T${hora}`
      };
    });

    res.json({
      success: true,
      data: funcionesFormateadas
    });
  } catch (error) {
    console.error('Error al obtener funciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las funciones',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

