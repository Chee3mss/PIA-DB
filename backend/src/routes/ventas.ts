import { Router } from 'express';
import {
  getAllVentas,
  getVentaById,
  getVentasStats
} from '../controllers/ventasController';

const router = Router();

// Rutas de ventas (requieren autenticación de empleado)
router.get('/', getAllVentas);
router.get('/stats', getVentasStats);
router.get('/:id', getVentaById);

export default router;

