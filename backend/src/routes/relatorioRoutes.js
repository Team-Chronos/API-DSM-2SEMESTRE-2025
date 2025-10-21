import express from 'express';
import { listarRelatorios, gerarRelatorio } from '../controllers/relatorioController.js';

const router = express.Router();

router.get('/', listarRelatorios);

router.post('/gerar', gerarRelatorio);

export default router;
