import express from 'express';
import { getVeiculos } from '../controllers/cotacaoController.js';

const router = express.Router();

router.get("/wexVeiculos", getVeiculos)

export default router;