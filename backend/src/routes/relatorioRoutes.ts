import express from 'express';
import graficoDados from '../service/graficoDados.js';

const router = express.Router();

router.get('/grafico', graficoDados);

export default router;