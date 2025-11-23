import { Router } from 'express';
import { testResumenVentas, testReporteVentasEvento, testTriggers } from '../controllers/testController';

const router = Router();

// Test endpoints
router.get('/view/resumen-ventas', testResumenVentas);
router.get('/sp/reporte-evento/:id_evento?', testReporteVentasEvento);
router.get('/triggers', testTriggers);

export default router;
