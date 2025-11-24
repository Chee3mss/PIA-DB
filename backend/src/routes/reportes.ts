import { Router } from 'express';
import { 
    getReporteVentasEvento,
    getVentasDelDia,
    getFuncionesMasVendidas,
    getClientesMasCompradores,
    getHorariosConMasVentas,
    getEventosMasVendidos,
    getEstadisticasGenerales,
    syncFuncionesStats
} from '../controllers/reportesController';

const router = Router();

// Get sales report for a specific event
router.get('/ventas/:id_evento', getReporteVentasEvento);

// Nuevos reportes
router.get('/ventas-del-dia', getVentasDelDia);
router.get('/funciones-mas-vendidas', getFuncionesMasVendidas);
router.get('/clientes-top', getClientesMasCompradores);
router.get('/horarios-ventas', getHorariosConMasVentas);
router.get('/eventos-mas-vendidos', getEventosMasVendidos);
router.get('/estadisticas-generales', getEstadisticasGenerales);

// Endpoint administrativo para sincronizar estadísticas
router.post('/sync-funciones-stats', syncFuncionesStats);

export default router;
