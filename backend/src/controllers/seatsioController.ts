import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import seatsioService from '../services/seatsioService';

/**
 * Controlador para la gestión de Seats.io
 */

// Obtener charts disponibles de Seats.io
export const getCharts = async (_req: Request, res: Response) => {
  try {
    if (!seatsioService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Seats.io no está configurado. Verifica SEATSIO_SECRET_KEY en .env' 
      });
    }

    const charts = await seatsioService.getCharts();
    
    res.json({
      charts,
      total: charts.length,
      publicKey: seatsioService.getPublicKey(),
      region: seatsioService.getRegion()
    });
  } catch (error: any) {
    console.error('Error al obtener charts:', error);
    res.status(500).json({ error: error.message || 'Error al obtener charts' });
  }
};

// Obtener configuración global de Seats.io
export const getConfig = async (_req: Request, res: Response) => {
  try {
    const [config] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Seatsio_Config'
    );

    res.json({
      config,
      isConfigured: seatsioService.isConfigured(),
      publicKey: seatsioService.getPublicKey(),
      region: seatsioService.getRegion()
    });
  } catch (error: any) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

// Actualizar configuración global
export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { config_key, config_value } = req.body;

    if (!config_key) {
      return res.status(400).json({ error: 'config_key es requerido' });
    }

    await pool.execute(
      `INSERT INTO Seatsio_Config (config_key, config_value) 
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE config_value = ?`,
      [config_key, config_value, config_value]
    );

    res.json({ 
      success: true, 
      message: 'Configuración actualizada',
      config_key,
      config_value
    });
  } catch (error: any) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};

// Crear evento automáticamente en Seats.io para una función
export const createEventForFunction = async (req: Request, res: Response) => {
  try {
    const { id_funcion } = req.params;
    const { chartKey } = req.body;

    if (!seatsioService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Seats.io no está configurado' 
      });
    }

    // Obtener información de la función y evento
    const [funciones] = await pool.execute<RowDataPacket[]>(
      `SELECT f.*, e.nombre_evento, e.descripcion, a.nombre as auditorio_nombre
       FROM Funciones f
       JOIN Evento e ON f.id_evento = e.id_evento
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       WHERE f.id_funcion = ?`,
      [id_funcion]
    );

    if (funciones.length === 0) {
      return res.status(404).json({ error: 'Función no encontrada' });
    }

    const funcion = funciones[0];

    // Verificar si ya tiene un evento de Seats.io
    if (funcion.seatsio_event_key) {
      return res.status(400).json({ 
        error: 'Esta función ya tiene un evento de Seats.io vinculado',
        eventKey: funcion.seatsio_event_key
      });
    }

    // Obtener el chart key (de parámetro o de configuración)
    let useChartKey = chartKey;
    if (!useChartKey) {
      const [config] = await pool.execute<RowDataPacket[]>(
        "SELECT config_value FROM Seatsio_Config WHERE config_key = 'default_chart_key'"
      );
      useChartKey = config[0]?.config_value;
    }

    if (!useChartKey) {
      return res.status(400).json({ 
        error: 'No hay un chart key configurado. Proporciona chartKey o configura default_chart_key' 
      });
    }

    // Crear evento en Seats.io
    const eventName = `${funcion.nombre_evento} - ${funcion.auditorio_nombre} - ${funcion.fecha} ${funcion.hora}`;
    const seatsioEvent = await seatsioService.createEvent({
      chartKey: useChartKey,
      eventName,
      date: funcion.fecha
    });

    // Actualizar la función con el event key
    await pool.execute(
      `UPDATE Funciones 
       SET seatsio_event_key = ?, seatsio_chart_key = ?
       WHERE id_funcion = ?`,
      [seatsioEvent.key, useChartKey, id_funcion]
    );

    // Registrar en log
    await pool.execute(
      `INSERT INTO Seatsio_Sync_Log 
       (entity_type, entity_id, seatsio_key, action, success)
       VALUES ('funcion', ?, ?, 'create', TRUE)`,
      [id_funcion, seatsioEvent.key]
    );

    res.json({
      success: true,
      message: 'Evento creado automáticamente en Seats.io',
      seatsioEventKey: seatsioEvent.key,
      chartKey: useChartKey,
      funcion: {
        id: id_funcion,
        nombre: eventName
      }
    });

  } catch (error: any) {
    console.error('Error al crear evento en Seats.io:', error);
    
    // Registrar error en log
    if (req.params.id_funcion) {
      await pool.execute(
        `INSERT INTO Seatsio_Sync_Log 
         (entity_type, entity_id, action, success, error_message)
         VALUES ('funcion', ?, 'create', FALSE, ?)`,
        [req.params.id_funcion, error.message]
      );
    }

    res.status(500).json({ error: error.message || 'Error al crear evento en Seats.io' });
  }
};

// Sincronizar todas las funciones que no tienen evento de Seats.io
export const syncAllFunctions = async (_req: Request, res: Response) => {
  try {
    if (!seatsioService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Seats.io no está configurado' 
      });
    }

    // Obtener chart key por defecto
    const [config] = await pool.execute<RowDataPacket[]>(
      "SELECT config_value FROM Seatsio_Config WHERE config_key = 'default_chart_key'"
    );
    
    const defaultChartKey = config[0]?.config_value;
    
    if (!defaultChartKey) {
      return res.status(400).json({ 
        error: 'Configura primero el default_chart_key' 
      });
    }

    // Obtener funciones sin evento de Seats.io
    const [funciones] = await pool.execute<RowDataPacket[]>(
      `SELECT f.*, e.nombre_evento, e.descripcion, a.nombre as auditorio_nombre
       FROM Funciones f
       JOIN Evento e ON f.id_evento = e.id_evento
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       WHERE f.seatsio_event_key IS NULL
       ORDER BY f.fecha, f.hora`
    );

    const results = {
      total: funciones.length,
      success: 0,
      failed: 0,
      events: [] as any[]
    };

    // Crear evento para cada función
    for (const funcion of funciones) {
      try {
        const eventName = `${funcion.nombre_evento} - ${funcion.auditorio_nombre} - ${funcion.fecha} ${funcion.hora}`;
        
        const seatsioEvent = await seatsioService.createEvent({
          chartKey: defaultChartKey,
          eventName,
          date: funcion.fecha
        });

        await pool.execute(
          `UPDATE Funciones 
           SET seatsio_event_key = ?, seatsio_chart_key = ?
           WHERE id_funcion = ?`,
          [seatsioEvent.key, defaultChartKey, funcion.id_funcion]
        );

        await pool.execute(
          `INSERT INTO Seatsio_Sync_Log 
           (entity_type, entity_id, seatsio_key, action, success)
           VALUES ('funcion', ?, ?, 'create', TRUE)`,
          [funcion.id_funcion, seatsioEvent.key]
        );

        results.success++;
        results.events.push({
          id_funcion: funcion.id_funcion,
          nombre: eventName,
          seatsio_key: seatsioEvent.key,
          status: 'success'
        });

      } catch (error: any) {
        results.failed++;
        results.events.push({
          id_funcion: funcion.id_funcion,
          nombre: funcion.nombre_evento,
          status: 'failed',
          error: error.message
        });

        await pool.execute(
          `INSERT INTO Seatsio_Sync_Log 
           (entity_type, entity_id, action, success, error_message)
           VALUES ('funcion', ?, 'create', FALSE, ?)`,
          [funcion.id_funcion, error.message]
        );
      }
    }

    res.json({
      message: 'Sincronización completada',
      ...results
    });

  } catch (error: any) {
    console.error('Error en sincronización:', error);
    res.status(500).json({ error: error.message || 'Error en sincronización' });
  }
};

// Obtener el event key de Seats.io para una función
export const getEventKeyForFunction = async (req: Request, res: Response) => {
  try {
    const { id_funcion } = req.params;

    const [funciones] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        f.id_funcion,
        f.seatsio_event_key,
        f.seatsio_chart_key,
        e.nombre_evento,
        f.fecha,
        f.hora,
        a.nombre as auditorio_nombre,
        s.nombre_sede
       FROM Funciones f
       JOIN Evento e ON f.id_evento = e.id_evento
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       JOIN Sede s ON a.id_sede = s.id_sede
       WHERE f.id_funcion = ?`,
      [id_funcion]
    );

    if (funciones.length === 0) {
      return res.status(404).json({ error: 'Función no encontrada' });
    }

    const funcion = funciones[0];

    if (!funcion.seatsio_event_key) {
      return res.status(404).json({ 
        error: 'Esta función no tiene un evento de Seats.io configurado',
        funcion: {
          id: funcion.id_funcion,
          nombre: funcion.nombre_evento
        }
      });
    }

    res.json({
      seatsio_event_key: funcion.seatsio_event_key,
      seatsio_chart_key: funcion.seatsio_chart_key,
      seatsio_public_key: seatsioService.getPublicKey(),
      seatsio_region: seatsioService.getRegion(),
      funcion: {
        id: funcion.id_funcion,
        nombre: funcion.nombre_evento,
        fecha: funcion.fecha,
        hora: funcion.hora,
        auditorio: funcion.auditorio_nombre,
        sede: funcion.nombre_sede
      }
    });

  } catch (error: any) {
    console.error('Error al obtener event key:', error);
    res.status(500).json({ error: 'Error al obtener información' });
  }
};

