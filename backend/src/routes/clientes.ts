import { Router } from 'express';
import {
  registrarCliente,
  loginCliente,
  getPerfilCliente,
  updatePerfilCliente,
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
router.put('/:id/perfil', updatePerfilCliente);
router.get('/:id/compras', getComprasCliente);

export default router;

