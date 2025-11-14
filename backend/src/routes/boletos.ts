import { Router } from 'express';
import {
  getAllBoletos,
  getBoletosByEvento,
  getBoletosStats
} from '../controllers/boletosController';

const router = Router();

// Rutas de boletos (requieren autenticación de empleado)
router.get('/', getAllBoletos);
router.get('/stats', getBoletosStats);
router.get('/evento/:id', getBoletosByEvento);

export default router;

