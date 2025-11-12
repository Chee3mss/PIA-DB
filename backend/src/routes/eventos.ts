import { Router } from 'express';
import {
  getEventos,
  getEventoById,
  getEventosByCategoria,
  getEventosPopulares,
  searchEventos,
  getCategorias,
  createEvento,
  updateEvento,
  deleteEvento
} from '../controllers/eventosController';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

// Ruta de debug para verificar BD directamente
router.get('/debug/db', async (req, res) => {
  try {
    const [eventos] = await pool.execute<RowDataPacket[]>(
      'SELECT id_evento, nombre_evento, imagen_url, id_tipo_evento FROM Evento ORDER BY id_evento ASC'
    );
    
    res.json({
      total: eventos.length,
      timestamp: new Date().toISOString(),
      eventos: eventos
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar BD', details: error });
  }
});

// Rutas públicas
router.get('/', getEventos);
router.get('/populares', getEventosPopulares);
router.get('/buscar', searchEventos);
router.get('/categorias', getCategorias);
router.get('/categoria/:id_tipo', getEventosByCategoria);
router.get('/:id', getEventoById);

// Rutas admin (TODO: agregar middleware de autenticación)
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

export default router;

