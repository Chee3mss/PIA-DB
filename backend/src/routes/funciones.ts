import { Router } from 'express';
import { crearFuncion, eliminarFuncion, obtenerFuncionesPorEvento } from '../controllers/funcionesController';

const router = Router();

router.post('/', crearFuncion);
router.delete('/:id', eliminarFuncion);
router.get('/evento/:id_evento', obtenerFuncionesPorEvento);

export default router;

