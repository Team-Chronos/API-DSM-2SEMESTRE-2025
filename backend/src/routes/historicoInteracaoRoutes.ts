import express from 'express';
import {
    registrarInteracao,
    listarInteracoesPorCliente,
    listarInteracoesPorVendedor,
    obterInteracaoPorId,
    atualizarInteracao,
    excluirInteracao
} from '../controllers/historicoInteracaoController.js';

const router = express.Router();

router.post('/', registrarInteracao);
router.get('/cliente/:id', listarInteracoesPorCliente);
router.get('/vendedor/:id', listarInteracoesPorVendedor);
router.get('/:id', obterInteracaoPorId);
router.put('/:id', atualizarInteracao);
router.delete('/:id', excluirInteracao);

export default router;