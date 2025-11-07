import express from 'express';
import { criarChecklist, listarChecklists, obterChecklistPorId, excluirChecklist } from '../controllers/checklistController.js';

const router = express.Router();

router.post('/checklist', criarChecklist);
router.get('/checklist', listarChecklists);
router.get('/checklist/:id', obterChecklistPorId);
router.delete('/checklist/:id', excluirChecklist);

export default router;
