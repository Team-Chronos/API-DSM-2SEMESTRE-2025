import express from 'express';
import {criarCliente, listarClientes, obterClientePorId, atualizarCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/', criarCliente);
router.get('/', listarClientes);
router.get('/:id', obterClientePorId);
router.put('/:id', atualizarCliente);

export default router;