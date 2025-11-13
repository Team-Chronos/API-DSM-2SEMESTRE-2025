import express from 'express';
import {
    criarTarefa,
    listarTarefasVendedor,
    listarTarefasProximas,
    atualizarStatusTarefa,
    obterTarefaPorId,
    atualizarTarefa,
    excluirTarefa
} from '../controllers/agendaController.js';

const router = express.Router();

router.post('/', criarTarefa);
router.get('/vendedor/:id', listarTarefasVendedor);
router.get('/proximas/:id', listarTarefasProximas);
router.get('/:id', obterTarefaPorId);
router.patch('/status/:id', atualizarStatusTarefa);
router.put('/:id', atualizarTarefa);
router.delete('/:id', excluirTarefa);

export default router;