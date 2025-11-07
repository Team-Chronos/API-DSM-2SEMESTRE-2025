import express from 'express';
import multer from "multer";
import { listarResponsaveis, registrarChecklist } from '../controllers/checklistVeiculoAgregadoController.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const campos = [
  { name: "foto_motor", maxCount: 1 },
  { name: "foto_etiqueta_troca_oleo", maxCount: 1 },
  { name: "pne_foto", maxCount: 1 },
  { name: "pte_foto", maxCount: 1 },
  { name: "ptd_foto", maxCount: 1 },
  { name: "pdd_foto", maxCount: 1 },
  { name: "foto_frente", maxCount: 1 },
  { name: "foto_lateral_direita", maxCount: 1 },
  { name: "foto_lateral_esquerda", maxCount: 1 },
  { name: "foto_traseira", maxCount: 1 }
]

router.post("/", upload.fields(campos), registrarChecklist)

router.get("/responsaveis", listarResponsaveis)

export default router;