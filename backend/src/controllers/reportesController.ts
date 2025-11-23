import { Request, Response } from 'express';
import pool from '../config/database';

export const getReporteVentasEvento = async (req: Request, res: Response) => {
    try {
        const { id_evento } = req.params;

        // Call the stored procedure
        const [rows] = await pool.query('CALL sp_reporte_ventas_evento(?)', [id_evento]);

        // Stored procedures return an array of arrays (result sets). 
        // The first element is the result set of the SELECT statement in the SP.
        const reporte = (rows as any)[0];

        res.json({
            success: true,
            data: reporte
        });
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        res.status(500).json({ error: 'Error al obtener reporte' });
    }
};
