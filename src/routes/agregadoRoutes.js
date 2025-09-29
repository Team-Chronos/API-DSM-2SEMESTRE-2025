import express from 'express';
import { criarAgregado } from '../controllers/agregadoController.js';

const router = express.Router();

router.post('/', criarAgregado);

export default router;