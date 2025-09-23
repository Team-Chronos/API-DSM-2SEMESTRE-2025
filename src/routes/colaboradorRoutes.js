import express from 'express';
import {
    criarColaborador,
    listarColaboradores,
    obterColaboradorPorId,
    atualizarColaborador,
    excluirColaborador
} from '../controllers/colaboradorController.js';

const router = express.Router();

router.post('/', criarColaborador);          
router.get('/', listarColaboradores);         
router.get('/:id', obterColaboradorPorId);    
router.put('/:id', atualizarColaborador);     
router.delete('/:id', excluirColaborador);    

export default router;