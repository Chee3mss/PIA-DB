import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// Test endpoint para vw_resumen_ventas
export const testResumenVentas = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM vw_resumen_ventas LIMIT 10'
        );

        res.json({
            success: true,
            message: 'Vista vw_resumen_ventas funciona correctamente',
            count: rows.length,
            data: rows
        });
    } catch (error: any) {
        console.error('Error testing vw_resumen_ventas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Test endpoint para sp_reporte_ventas_evento
export const testReporteVentasEvento = async (req: Request, res: Response) => {
    try {
        const id_evento = req.params.id_evento || 1; // Default evento 1

        const [rows] = await pool.query('CALL sp_reporte_ventas_evento(?)', [id_evento]);
        const reporte = (rows as any)[0];

        res.json({
            success: true,
            message: 'SP sp_reporte_ventas_evento funciona correctamente',
            id_evento,
            data: reporte
        });
    } catch (error: any) {
        console.error('Error testing sp_reporte_ventas_evento:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Test endpoint para verificar triggers
export const testTriggers = async (_req: Request, res: Response) => {
    try {
        // Verificar que los triggers existen
        const [triggers] = await pool.execute<RowDataPacket[]>(
            `SHOW TRIGGERS FROM stageGo WHERE Trigger IN ('trg_actualizar_estadisticas_funcion', 'trg_actualizar_uso_promocion')`
        );

        res.json({
            success: true,
            message: 'Triggers verificados',
            count: triggers.length,
            triggers: triggers.map((t: any) => ({
                name: t.Trigger,
                event: t.Event,
                table: t.Table,
                timing: t.Timing
            }))
        });
    } catch (error: any) {
        console.error('Error testing triggers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
