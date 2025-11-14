import express from 'express';
import {
  getAuditorios,
  getAuditorioById,
  getSeatsioConfigByFuncion,
  updateSeatsioConfig,
  createAuditorio,
  updateAuditorio,
  deleteAuditorio,
  getSedes
} from '../controllers/auditoriosController';

const router = express.Router();

// Rutas públicas
router.get('/', getAuditorios);
router.get('/sedes', getSedes);
router.get('/:id', getAuditorioById);
router.get('/seatsio/funcion/:id_funcion', getSeatsioConfigByFuncion);

// Rutas admin (agregar middleware de autenticación según sea necesario)
router.post('/', createAuditorio);
router.put('/:id', updateAuditorio);
router.put('/:id/seatsio', updateSeatsioConfig);
router.delete('/:id', deleteAuditorio);

export default router;

