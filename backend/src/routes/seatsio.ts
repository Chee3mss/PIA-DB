import express from 'express';
import {
  getCharts,
  getConfig,
  updateConfig,
  createEventForFunction,
  syncAllFunctions,
  getEventKeyForFunction
} from '../controllers/seatsioController';

const router = express.Router();

// Rutas de configuración
router.get('/charts', getCharts); // Obtener charts disponibles
router.get('/config', getConfig); // Obtener configuración
router.put('/config', updateConfig); // Actualizar configuración

// Rutas de eventos
router.get('/function/:id_funcion', getEventKeyForFunction); // Obtener event key de una función
router.post('/function/:id_funcion/create', createEventForFunction); // Crear evento para función
router.post('/sync-all', syncAllFunctions); // Sincronizar todas las funciones

export default router;

