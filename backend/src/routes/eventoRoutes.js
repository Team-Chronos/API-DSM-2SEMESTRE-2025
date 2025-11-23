import express from "express";
import {
  criarEvento,
  listarEventos,
  getEventoPorId,
  atualizarEvento,
  excluirEvento,
  getParticipantesDoEvento,
} from "../controllers/eventoController.js";
const router = express.Router();

router.post("/", criarEvento);
router.get("/", listarEventos);
router.get("/:id/participantes", getParticipantesDoEvento);
router.get("/:id", getEventoPorId);
router.put("/:id", atualizarEvento);
router.delete("/:id", excluirEvento);

export default router;
