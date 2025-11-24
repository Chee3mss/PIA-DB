import { Router } from 'express';
import {
  getAllTipoBoletos,
  getTipoBoletosbyAuditorio,
  updateTipoBoletoPrecio,
  updateTipoBoleto,
  createTipoBoleto,
  deleteTipoBoleto
} from '../controllers/tipoBoletosController';

const router = Router();

// Rutas de tipos de boleto
router.get('/', getAllTipoBoletos);
router.get('/auditorio/:id_auditorio', getTipoBoletosbyAuditorio);
router.post('/', createTipoBoleto);
router.put('/:id', updateTipoBoleto);
router.patch('/:id/precio', updateTipoBoletoPrecio);
router.delete('/:id', deleteTipoBoleto);

export default router;

