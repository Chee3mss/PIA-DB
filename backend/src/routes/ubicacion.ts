import { Router } from 'express';
import {
  getEstados,
  getMunicipiosByEstado,
  getAllMunicipios
} from '../controllers/ubicacionController';

const router = Router();

// Rutas de ubicación
router.get('/estados', getEstados);
router.get('/municipios', getAllMunicipios);
router.get('/estados/:idEstado/municipios', getMunicipiosByEstado);

export default router;

