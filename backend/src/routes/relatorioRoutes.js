import express from 'express';
import { listarRelatorios, gerarRelatorio, downloadRelatorio, excluirRelatorio } from '../controllers/relatorioController.js'; 

const router = express.Router();

router.get('/', listarRelatorios);
router.post('/gerar', gerarRelatorio);
router.get('/download/:filename', downloadRelatorio);
router.delete('/:id', excluirRelatorio);

export default router;

