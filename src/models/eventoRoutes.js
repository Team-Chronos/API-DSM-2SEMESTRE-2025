import express from 'express';
import { verificarToken } from '../routes/authMiddleware.js';
import { criarEvento, listarEventos, obterEventoPorId } from './eventoController.js';

const router = express.Router();

router.post('/', verificarToken, criarEvento);
router.get('/', verificarToken, listarEventos);
router.get('/:id', verificarToken, obterEventoPorId);

export default router;