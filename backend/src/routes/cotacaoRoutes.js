import express from 'express';
import { buscarCotacaoPorId, cadastrarCotacao, deletarCotacao, getVeiculos, listarCotacoes } from '../controllers/cotacaoController.js';

const router = express.Router();

router.get("/wexVeiculos", getVeiculos)
router.post("/", cadastrarCotacao);
router.get("/", listarCotacoes);
router.get("/:id", buscarCotacaoPorId);
router.delete("/:id", deletarCotacao);

export default router;