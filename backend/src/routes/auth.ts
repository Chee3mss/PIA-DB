import { Router } from 'express';
import {
  registerCliente,
  loginCliente,
  loginEmpleado,
  verifyToken
} from '../controllers/authController';

const router = Router();

// Rutas de autenticación
router.post('/register', registerCliente);
router.post('/login/cliente', loginCliente);
router.post('/login/empleado', loginEmpleado);
router.post('/login', loginCliente); // Por defecto, login de cliente
router.get('/verify', verifyToken);

export default router;

