import { Router } from 'express';
import { getReporteVentasEvento } from '../controllers/reportesController';

const router = Router();

// Get sales report for a specific event
router.get('/ventas/:id_evento', getReporteVentasEvento);

export default router;
