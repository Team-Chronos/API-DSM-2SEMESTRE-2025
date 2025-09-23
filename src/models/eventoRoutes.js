import express from 'express';
import { criarEvento, listarEventos, obterEventoPorId } from '../controllers/eventoController.js';
import { verificarToken } from './authMiddleware.js'; // Você pode criar este middleware simples

const router = express.Router();

router.post('/', verificarToken, criarEvento);
router.get('/', verificarToken, listarEventos);
router.get('/:id', verificarToken, obterEventoPorId);

export default router;