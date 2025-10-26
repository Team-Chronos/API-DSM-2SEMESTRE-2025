import express from 'express';
import { 
    listarClientes, 
    criarCliente, 
    listarClientePorId, 
    listarCidades, 
    listarSegmentos,
    atualizarEtapaCliente
} from '../controllers/clienteController.js'; 

const router = express.Router();

router.get('/', listarClientes);
router.get('/cidades', listarCidades); 
router.get('/segmentos', listarSegmentos);
router.get('/:id', listarClientePorId);
router.post('/', criarCliente);
router.put('/:id/etapa', atualizarEtapaCliente);

export default router;

