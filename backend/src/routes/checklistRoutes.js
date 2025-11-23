import express from "express";
import {
  criarChecklist,
  listarChecklists,
  obterChecklistPorId,
  excluirChecklist,
} from "../controllers/checklistController.js";

const router = express.Router();

router.post("/", criarChecklist);
router.get("/", listarChecklists);
router.get("/:id", obterChecklistPorId);
router.delete("/:id", excluirChecklist);

export default router;
