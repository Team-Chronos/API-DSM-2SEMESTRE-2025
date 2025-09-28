import express from 'express';
import { listarParticipacaoEvento, atualizarParticipacaoEvento } from '../controllers/participacaoEventoController.js';
const router = express.Router();

router.get('/:id', listarParticipacaoEvento);
router.put('/:id_col/:id_evento', atualizarParticipacaoEvento);


export default router;