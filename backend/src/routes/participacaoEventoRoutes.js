import express from 'express';
import { listarParticipacaoEvento, atualizarParticipacaoEvento, obterParticipacaoEventoPorID } from '../controllers/participacaoEventoController.js';
const router = express.Router();

router.get('/:id', listarParticipacaoEvento);
router.put('/:id_col/:id_evento', atualizarParticipacaoEvento);
router.get('/:id_col/:id_evento', obterParticipacaoEventoPorID)


export default router;