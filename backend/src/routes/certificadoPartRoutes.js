import express from 'express';
import { criarCertPartEvento, listarCertPartEvento, obterCertPartEventoPorID } from '../controllers/certificadoPartController.js';
const router = express.Router();

router.get('/:id', listarCertPartEvento);
router.get('/:id_col/:id_evento', obterCertPartEventoPorID)
router.post('/', criarCertPartEvento)


export default router;