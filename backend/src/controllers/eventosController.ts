import { Request, Response } from 'express';
import { query } from '../config/database';
import { Evento, Funcion, ApiResponse, TipoBoleto } from '../types';

// Obtener todos los eventos
export const getEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventos = await query<Evento[]>(
      `SELECT e.*, te.nombre_tipo as tipo_evento_nombre 
       FROM Evento e 
       LEFT JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       ORDER BY e.fecha_inicio DESC`
    );

    const response: ApiResponse<Evento[]> = {
      success: true,
      data: eventos,
      message: `Se encontraron ${eventos.length} eventos`
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos'
    });
  }
};

// Obtener un evento por ID con sus funciones
export const getEventoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Obtener datos del evento
    const eventos = await query<Evento[]>(
      `SELECT e.*, te.nombre_tipo as tipo_evento_nombre 
       FROM Evento e 
       LEFT JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
       WHERE e.id_evento = ?`,
      [id]
    );

    if (eventos.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Evento no encontrado'
      });
      return;
    }

    // Obtener funciones del evento
    const funciones = await query<Funcion[]>(
      `SELECT f.*, a.nombre as auditorio_nombre, s.nombre_sede 
       FROM Funciones f
       LEFT JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       LEFT JOIN Sede s ON a.id_sede = s.id_sede
       WHERE f.id_evento = ?
       ORDER BY f.fecha, f.hora`,
      [id]
    );

    const response: ApiResponse = {
      success: true,
      data: {
        evento: eventos[0],
        funciones: funciones
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener evento'
    });
  }
};

// Obtener boletos disponibles para una función
export const getBoletosDisponibles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idFuncion } = req.params;

    const boletos = await query(
      `SELECT b.*, tb.nombre_tipo, tb.precio_base, z.nombre_zona, z.precio_multiplicador,
              eb.nombre as estado_nombre
       FROM Boletos b
       LEFT JOIN Tipo_Boleto tb ON b.id_tipo_boleto = tb.id_tipo_boleto
       LEFT JOIN Zonas z ON tb.id_zona = z.id_zona
       LEFT JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
       WHERE b.id_funcion = ? AND eb.nombre = 'Disponible'
       ORDER BY z.nombre_zona, b.asiento`,
      [idFuncion]
    );

    res.json({
      success: true,
      data: boletos
    });
  } catch (error) {
    console.error('Error al obtener boletos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener boletos disponibles'
    });
  }
};

// Obtener tipos de boletos para una función
export const getTiposBoletos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idFuncion } = req.params;

    const tipos = await query(
      `SELECT tb.*, z.nombre_zona, z.descripcion as zona_descripcion,
              COUNT(b.id_boleto) as disponibles
       FROM Funciones f
       JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
       JOIN Zonas z ON z.id_auditorio = a.id_auditorio
       JOIN Tipo_Boleto tb ON tb.id_zona = z.id_zona
       LEFT JOIN Boletos b ON b.id_tipo_boleto = tb.id_tipo_boleto 
              AND b.id_funcion = f.id_funcion 
              AND b.id_estado_boleto = (SELECT id_estado_boleto FROM Estado_Boleto WHERE nombre = 'Disponible')
       WHERE f.id_funcion = ? AND tb.activo = 1
       GROUP BY tb.id_tipo_boleto, z.nombre_zona`,
      [idFuncion]
    );

    res.json({
      success: true,
      data: tipos
    });
  } catch (error) {
    console.error('Error al obtener tipos de boletos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tipos de boletos'
    });
  }
};

