import express from 'express';
import { listarClientes } from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', listarClientes)

export default router