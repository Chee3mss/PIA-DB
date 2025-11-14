import { Router } from 'express';
import {
  registerCliente,
  registerEmpleado,
  loginCliente,
  loginEmpleado,
  loginUnificado,
  verifyToken
} from '../controllers/authController';

const router = Router();

// Rutas de autenticación
router.post('/register', registerCliente);
router.post('/register/empleado', registerEmpleado);
router.post('/login/cliente', loginCliente);
router.post('/login/empleado', loginEmpleado);
router.post('/login', loginUnificado); // Login unificado para clientes y empleados
router.get('/verify', verifyToken);

export default router;

