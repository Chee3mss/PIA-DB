import { Router } from 'express';
import {
  getEventos,
  getEventoById,
  getBoletosDisponibles,
  getTiposBoletos
} from '../controllers/eventosController';

const router = Router();

// Rutas de eventos
router.get('/', getEventos);
router.get('/:id', getEventoById);
router.get('/:idFuncion/boletos', getBoletosDisponibles);
router.get('/:idFuncion/tipos-boletos', getTiposBoletos);

export default router;

