import express from 'express';
import { listarClientes, criarCliente, listarClientePorId, atualizarEtapaCliente } from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', listarClientes);
router.get('/:id', listarClientePorId)
router.post('/', criarCliente);
router.put("/clientes/:id/etapa", atualizarEtapaCliente);

export default router;