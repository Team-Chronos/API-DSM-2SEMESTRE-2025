import express from 'express';
import { listarClientes, criarCliente, listarClientePorId, listarCidades } from '../controllers/clienteController.js'; 

const router = express.Router();

router.get('/', listarClientes);
router.get('/cidades', listarCidades);
router.get('/:id', listarClientePorId);
router.post('/', criarCliente);

export default router;

