import express from 'express';
import * as controller from '../controllers/clientController.js';
import * as controller1 from '../controllers/pedidoController.js';
import * as controller2 from '../controllers/produtoControllers.js';
import * as controller3 from '../controllers/itemPedidoController.js';
import autenticarApiKey from ''

const router = express.Router();

router.post('/cliente', controller.criar);
router.get('/cliente', controller.buscarTodos);
router.get('/cliente/:id', controller.buscarPorId);
router.put('/cliente/:id', controller.atualizar);
router.delete('/cliente/:id', controller.deletar);

router.post('/pedidos', controller1.criar);
router.get('/pedidos', controller1.buscarTodos);
router.get('/pedidos/:id', controller1.buscarPorId);
router.put('/pedidos/:id', controller1.pagar);
router.delete('/pedidos/:id', controller1.cancelar);

router.post('/produtos', controller2.criar);
router.get('/produtos', controller2.buscarTodos);
router.get('/produtos/:id', controller2.buscarPorId);
router.put('/produtos/:id', controller2.atualizar);
router.delete('/produtos/:id', controller2.deletar);

router.post('/itemPedido', controller3.criar);
router.get('/itemPedido', controller3.buscarTodos);
router.get('/itemPedido/:id', controller3.buscarPorId);
router.put('/itemPedido/:id', controller3.atualizar);
router.delete('/itemPedido/:id', controller3.deletar);

export default router;
