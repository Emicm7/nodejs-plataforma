import { Router } from 'express';
import * as personaController from '../controllers/persona.controller';

const router = Router();

router.post('/', personaController.store);
router.get('/', personaController.index);
router.get('/:id', personaController.show);
router.put('/:id', personaController.update);
router.delete('/:id', personaController.destroy);

export default router;