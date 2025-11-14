import { Router } from 'express';
import {
  registrarCliente,
  loginCliente,
  getPerfilCliente,
  getComprasCliente,
  getAllClientes
} from '../controllers/clientesController';

const router = Router();

// Rutas de autenticación
router.post('/registro', registrarCliente);
router.post('/login', loginCliente);

// Rutas admin
router.get('/', getAllClientes);

// Rutas de perfil y compras
router.get('/:id/perfil', getPerfilCliente);
router.get('/:id/compras', getComprasCliente);

export default router;

