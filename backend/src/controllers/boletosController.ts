import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Obtener todos los boletos
export const getAllBoletos = async (req: Request, res: Response) => {
  try {
    const [boletos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        b.id_boleto,
        b.asiento,
        b.precio_final,
        b.vigente,
        tb.nombre_tipo,
        eb.nombre as estado_boleto,
        f.fecha as fecha_funcion,
        f.hora as hora_funcion,
        ev.nombre_evento,
        ev.imagen_url,
        a.nombre as nombre_auditorio,
        s.nombre_sede,
        z.nombre_zona,
        c.nombre_completo as nombre_cliente,
        c.email as email_cliente,
        v.id_venta,
        v.fecha as fecha_venta
      FROM Boletos b
      INNER JOIN Tipo_Boleto tb ON b.id_tipo_boleto = tb.id_tipo_boleto
      INNER JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
      INNER JOIN Funciones f ON b.id_funcion = f.id_funcion
      INNER JOIN Evento ev ON f.id_evento = ev.id_evento
      INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
      INNER JOIN Sede s ON a.id_sede = s.id_sede
      INNER JOIN Zonas z ON tb.id_zona = z.id_zona
      LEFT JOIN Ventas v ON b.id_venta = v.id_venta
      LEFT JOIN Clientes c ON v.id_cliente = c.id_cliente
      ORDER BY f.fecha DESC, f.hora DESC`
    );

    res.json({
      success: true,
      data: boletos
    });
  } catch (error) {
    console.error('Error al obtener boletos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener los boletos' 
    });
  }
};

// Obtener boletos por evento
export const getBoletosByEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [boletos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        b.id_boleto,
        b.asiento,
        b.precio_final,
        b.vigente,
        tb.nombre_tipo,
        eb.nombre as estado_boleto,
        f.fecha as fecha_funcion,
        f.hora as hora_funcion,
        z.nombre_zona,
        c.nombre_completo as nombre_cliente,
        v.id_venta
      FROM Boletos b
      INNER JOIN Tipo_Boleto tb ON b.id_tipo_boleto = tb.id_tipo_boleto
      INNER JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
      INNER JOIN Funciones f ON b.id_funcion = f.id_funcion
      INNER JOIN Zonas z ON tb.id_zona = z.id_zona
      LEFT JOIN Ventas v ON b.id_venta = v.id_venta
      LEFT JOIN Clientes c ON v.id_cliente = c.id_cliente
      WHERE f.id_evento = ?
      ORDER BY f.fecha, f.hora, z.nombre_zona, b.asiento`,
      [id]
    );

    res.json({
      success: true,
      data: boletos
    });
  } catch (error) {
    console.error('Error al obtener boletos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener los boletos del evento' 
    });
  }
};

// Obtener estadísticas de boletos
export const getBoletosStats = async (req: Request, res: Response) => {
  try {
    // Total de boletos por estado
    const [boletosPorEstado] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        eb.nombre as estado,
        COUNT(*) as cantidad
      FROM Boletos b
      INNER JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
      GROUP BY eb.id_estado_boleto`
    );

    // Boletos vendidos por evento (top 10)
    const [boletosTopEventos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        ev.nombre_evento,
        COUNT(b.id_boleto) as boletos_vendidos,
        SUM(b.precio_final) as recaudacion
      FROM Boletos b
      INNER JOIN Funciones f ON b.id_funcion = f.id_funcion
      INNER JOIN Evento ev ON f.id_evento = ev.id_evento
      INNER JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
      WHERE eb.nombre = 'Vendido'
      GROUP BY ev.id_evento
      ORDER BY boletos_vendidos DESC
      LIMIT 10`
    );

    // Ingresos totales
    const [ingresos] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        SUM(precio_final) as total_ingresos
      FROM Boletos b
      INNER JOIN Estado_Boleto eb ON b.id_estado_boleto = eb.id_estado_boleto
      WHERE eb.nombre = 'Vendido'`
    );

    res.json({
      success: true,
      data: {
        boletos_por_estado: boletosPorEstado,
        top_eventos: boletosTopEventos,
        total_ingresos: ingresos[0].total_ingresos || 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener estadísticas de boletos' 
    });
  }
};

