import express from 'express';
import { criarEvento,listarEventos,getEventoPorId,atualizarEvento,salvarLocalidade,excluirEvento } from '../controllers/eventoController.js';
const router = express.Router();

router.post('/localidade', salvarLocalidade);
router.post('/', criarEvento);
router.get('/', listarEventos);
router.get('/:id', getEventoPorId);    
router.put('/:id', atualizarEvento);     
router.delete('/:id', excluirEvento);

export default router;