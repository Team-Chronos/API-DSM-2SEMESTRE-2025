import express from 'express';
import {
    criarTarefa,
    listarTarefasVendedor,
    listarTarefasProximas,
    atualizarStatusTarefa
} from '../controllers/agendaController.js';

const router = express.Router();

router.post('/', criarTarefa);
router.get('/vendedor/:id', listarTarefasVendedor);
router.get('/proximas/:id', listarTarefasProximas);
router.put('/:id/status', atualizarStatusTarefa);

export default router;