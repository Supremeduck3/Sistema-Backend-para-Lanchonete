import express from 'express';
import * as controller from '../controllers/exemploController.js';

const router = express.Router();

router.post('/lanchonete', controller.criar);
router.get('/lanchonete', controller.buscarTodos);
router.get('/lanchonete/:id', controller.buscarPorId);
router.put('/lanchonete/:id', controller.atualizar);
router.delete('/lanchonete/:id', controller.deletar);

export default router;
