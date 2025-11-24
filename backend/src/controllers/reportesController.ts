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

// Reporte 1: Ventas del día actual
export const getVentasDelDia = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                v.id_venta,
                v.fecha,
                v.total,
                c.nombre_completo as cliente,
                e.nombre as empleado,
                COUNT(b.id_boleto) as cantidad_boletos,
                MAX(ev.nombre_evento) as evento
            FROM Ventas v
            INNER JOIN Clientes c ON v.id_cliente = c.id_cliente
            INNER JOIN Empleado e ON v.id_empleado = e.id_empleado
            LEFT JOIN Boletos b ON v.id_venta = b.id_venta
            LEFT JOIN Funciones f ON b.id_funcion = f.id_funcion
            LEFT JOIN Evento ev ON f.id_evento = ev.id_evento
            WHERE DATE(v.fecha) = CURDATE()
            GROUP BY v.id_venta, v.fecha, v.total, c.nombre_completo, e.nombre
            ORDER BY v.fecha DESC
        `;
        
        const [rows] = await pool.query(query);

        // Calcular totales
        const totalVentas = (rows as any[]).length;
        const totalRecaudado = (rows as any[]).reduce((sum, row) => sum + parseFloat(row.total), 0);
        const totalBoletos = (rows as any[]).reduce((sum, row) => sum + parseInt(row.cantidad_boletos), 0);

        res.json({
            success: true,
            data: {
                ventas: rows,
                resumen: {
                    total_ventas: totalVentas,
                    total_recaudado: totalRecaudado,
                    total_boletos: totalBoletos
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener ventas del día:', error);
        res.status(500).json({ error: 'Error al obtener ventas del día' });
    }
};

// Reporte 2: Funciones más vendidas en un periodo
export const getFuncionesMasVendidas = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT 
                f.id_funcion,
                e.nombre_evento,
                f.fecha,
                f.hora,
                a.nombre as auditorio,
                s.nombre_sede,
                f.boletos_vendidos,
                f.recaudacion,
                a.capacidad,
                ROUND((f.boletos_vendidos / a.capacidad) * 100, 2) as porcentaje_ocupacion
            FROM Funciones f
            INNER JOIN Evento e ON f.id_evento = e.id_evento
            INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
            INNER JOIN Sede s ON a.id_sede = s.id_sede
        `;

        const params: any[] = [];

        if (fecha_inicio && fecha_fin) {
            query += ` WHERE f.fecha BETWEEN ? AND ?`;
            params.push(fecha_inicio, fecha_fin);
        }

        query += ` ORDER BY f.boletos_vendidos DESC LIMIT 10`;

        const [rows] = await pool.query(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener funciones más vendidas:', error);
        res.status(500).json({ error: 'Error al obtener funciones más vendidas' });
    }
};

// Reporte 3: Clientes que más compran boletos
export const getClientesMasCompradores = async (req: Request, res: Response) => {
    try {
        const { limite } = req.query;
        const limit = limite ? parseInt(limite as string) : 10;

        const query = `
            SELECT 
                c.id_cliente,
                c.nombre_completo,
                c.email,
                c.telefono,
                COUNT(DISTINCT v.id_venta) as total_compras,
                COUNT(b.id_boleto) as total_boletos,
                SUM(v.total) as total_gastado,
                MAX(v.fecha) as ultima_compra
            FROM Clientes c
            INNER JOIN Ventas v ON c.id_cliente = v.id_cliente
            LEFT JOIN Boletos b ON v.id_venta = b.id_venta
            GROUP BY c.id_cliente
            ORDER BY total_boletos DESC
            LIMIT ?
        `;

        const [rows] = await pool.query(query, [limit]);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener clientes más compradores:', error);
        res.status(500).json({ error: 'Error al obtener clientes más compradores' });
    }
};

// Reporte 4: Horarios con más ventas
export const getHorariosConMasVentas = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                HOUR(f.hora) as hora,
                COUNT(DISTINCT f.id_funcion) as total_funciones,
                SUM(f.boletos_vendidos) as total_boletos_vendidos,
                SUM(f.recaudacion) as total_recaudacion,
                ROUND(AVG(f.boletos_vendidos), 2) as promedio_boletos_por_funcion
            FROM Funciones f
            WHERE f.boletos_vendidos > 0
            GROUP BY HOUR(f.hora)
            ORDER BY total_boletos_vendidos DESC
        `;

        const [rows] = await pool.query(query);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener horarios con más ventas:', error);
        res.status(500).json({ error: 'Error al obtener horarios con más ventas' });
    }
};

// Reporte 5: Eventos más vendidos en un periodo
export const getEventosMasVendidos = async (req: Request, res: Response) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = `
            SELECT 
                e.id_evento,
                e.nombre_evento,
                e.imagen_url,
                te.nombre_tipo as tipo_evento,
                COUNT(DISTINCT f.id_funcion) as total_funciones,
                SUM(f.boletos_vendidos) as total_boletos_vendidos,
                SUM(f.recaudacion) as total_recaudacion,
                AVG(f.boletos_vendidos) as promedio_boletos_por_funcion,
                MIN(f.fecha) as primera_funcion,
                MAX(f.fecha) as ultima_funcion
            FROM Evento e
            INNER JOIN Funciones f ON e.id_evento = f.id_evento
            INNER JOIN Tipo_Evento te ON e.id_tipo_evento = te.id_tipo_evento
        `;

        const params: any[] = [];

        if (fecha_inicio && fecha_fin) {
            query += ` WHERE f.fecha BETWEEN ? AND ?`;
            params.push(fecha_inicio, fecha_fin);
        }

        query += ` 
            GROUP BY e.id_evento
            ORDER BY total_boletos_vendidos DESC
            LIMIT 10
        `;

        const [rows] = await pool.query(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener eventos más vendidos:', error);
        res.status(500).json({ error: 'Error al obtener eventos más vendidos' });
    }
};

// Reporte 6: Estadísticas generales
export const getEstadisticasGenerales = async (req: Request, res: Response) => {
    try {
        // Total de ventas
        const [ventasTotal] = await pool.query(`
            SELECT 
                COUNT(*) as total_ventas,
                COALESCE(SUM(total), 0) as total_recaudado
            FROM Ventas
        `);

        // Total de boletos vendidos
        const [boletosTotal] = await pool.query(`
            SELECT COUNT(*) as total_boletos
            FROM Boletos
            WHERE id_estado_boleto = 3
        `);

        // Total de clientes registrados
        const [clientesTotal] = await pool.query(`
            SELECT COUNT(*) as total_clientes
            FROM Clientes
        `);

        // Total de eventos activos
        const [eventosTotal] = await pool.query(`
            SELECT COUNT(*) as total_eventos
            FROM Evento
            WHERE fecha_fin >= CURDATE()
        `);

        // Eventos más populares (top 5)
        const [eventosMasPopulares] = await pool.query(`
            SELECT 
                e.nombre_evento,
                SUM(f.boletos_vendidos) as boletos_vendidos
            FROM Evento e
            INNER JOIN Funciones f ON e.id_evento = f.id_evento
            GROUP BY e.id_evento
            ORDER BY boletos_vendidos DESC
            LIMIT 5
        `);

        // Método de pago más usado
        const [metodosPago] = await pool.query(`
            SELECT 
                mp.nombre_metodo,
                COUNT(*) as total_usos,
                SUM(v.total) as monto_total
            FROM Ventas v
            INNER JOIN Metodo_Pago mp ON v.id_metodo = mp.id_metodo
            GROUP BY mp.id_metodo
            ORDER BY total_usos DESC
        `);

        res.json({
            success: true,
            data: {
                ventas: (ventasTotal as any)[0],
                boletos: (boletosTotal as any)[0],
                clientes: (clientesTotal as any)[0],
                eventos: (eventosTotal as any)[0],
                eventosMasPopulares: eventosMasPopulares,
                metodosPago: metodosPago
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas generales:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas generales' });
    }
};

// Endpoint para sincronizar estadísticas de funciones (uso temporal/administrativo)
export const syncFuncionesStats = async (req: Request, res: Response) => {
    try {
        // Actualizar las estadísticas de todas las funciones
        await pool.query(`
            UPDATE Funciones f
            LEFT JOIN (
                SELECT 
                    b.id_funcion,
                    COUNT(*) as total_boletos,
                    SUM(b.precio_final) as total_recaudacion
                FROM Boletos b
                WHERE b.id_estado_boleto = 3
                GROUP BY b.id_funcion
            ) stats ON f.id_funcion = stats.id_funcion
            SET 
                f.boletos_vendidos = COALESCE(stats.total_boletos, 0),
                f.recaudacion = COALESCE(stats.total_recaudacion, 0.00)
        `);

        // Obtener las funciones actualizadas
        const [funcionesActualizadas] = await pool.query(`
            SELECT 
                f.id_funcion,
                e.nombre_evento,
                f.fecha,
                f.hora,
                f.boletos_vendidos,
                f.recaudacion,
                a.capacidad
            FROM Funciones f
            INNER JOIN Evento e ON f.id_evento = e.id_evento
            INNER JOIN Auditorio a ON f.id_auditorio = a.id_auditorio
            WHERE f.boletos_vendidos > 0
            ORDER BY f.boletos_vendidos DESC
        `);

        res.json({
            success: true,
            message: 'Estadísticas de funciones sincronizadas correctamente',
            data: funcionesActualizadas
        });
    } catch (error) {
        console.error('Error al sincronizar estadísticas:', error);
        res.status(500).json({ error: 'Error al sincronizar estadísticas de funciones' });
    }
};