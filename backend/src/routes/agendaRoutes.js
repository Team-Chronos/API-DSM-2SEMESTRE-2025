import express from 'express';
import {
    criarTarefa,
    listarTarefasVendedor,
    listarTarefasProximas,
    atualizarStatusTarefa,
    obterTarefaPorId,
    atualizarTarefa,
    excluirTarefa,
    criarCliente,
    listarClientes
} from '../controllers/agendaController.js';

const router = express.Router();

router.post('/', criarTarefa);
router.get('/vendedor/:id', listarTarefasVendedor);
router.get('/proximas/:id', listarTarefasProximas);
router.get('/:id', obterTarefaPorId);
router.put('/:id/status', atualizarStatusTarefa);
router.put('/:id', atualizarTarefa);
router.delete('/:id', excluirTarefa);

router.post('/clientes', criarCliente);
router.get('/clientes/todos', listarClientes);

export default router;