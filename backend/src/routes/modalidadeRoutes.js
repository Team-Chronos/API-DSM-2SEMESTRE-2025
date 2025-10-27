import express from "express";
import { registrarModalidade, historicoModalidades } from "../controllers/modalidadeController.js";

const router = express.Router();
router.get("/modalidades/historico/:colaboradorId", historicoModalidades);

router.post("/modalidades/registrar", registrarModalidade);

export default router;