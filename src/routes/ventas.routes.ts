import { Router } from 'express';
import { body } from 'express-validator';
import * as ventasController from '../controllers/ventas.controller';
import { validPersonaId } from '../helper/db-validator';
import { validateFields } from '../middlewares/validate-fields';

const router = Router();

router.post('/', [
  body('persona_id').custom(validPersonaId),
  validateFields
],ventasController.store);

router.get('/', ventasController.index);
router.post('/:ventaId/productos/:productoId',ventasController.agregarProductoToVenta);
router.get('/:id', ventasController.show);
router.put('/:id', ventasController.update);
router.delete('/:id', ventasController.destroy);
router.delete('/:ventaId/productos/:productoId',ventasController.borrarProductoToVenta);

export default router;