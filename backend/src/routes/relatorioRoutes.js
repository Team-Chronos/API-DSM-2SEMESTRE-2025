import express from 'express';
import {
    gerarRelatorioPDF,
    gerarRelatorioExcel,
    listarRelatorios,
    obterRelatorioPorId,
    excluirRelatorio,
    obterTiposRelatorio
} from '../controllers/relatorioController.js';

const router = express.Router();

router.post('/gerar-pdf', gerarRelatorioPDF);
router.post('/gerar-excel', gerarRelatorioExcel);
router.get('/tipos', obterTiposRelatorio);

router.get('/', listarRelatorios);
router.get('/:id', obterRelatorioPorId);
router.delete('/:id', excluirRelatorio);

export default router;