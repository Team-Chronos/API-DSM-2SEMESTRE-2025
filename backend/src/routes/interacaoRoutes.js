import express from 'express';
import { criarInteracao, listarInteracoes, listarInteracoesPorCliente } from '../controllers/interacaoController.js';

const router = express.Router();

router.get('/', listarInteracoes)
router.get("/:idCliente", listarInteracoesPorCliente)
router.post('/', criarInteracao)

export default router