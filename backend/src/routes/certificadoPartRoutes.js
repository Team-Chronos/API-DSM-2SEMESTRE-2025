import express from "express";
import {
  criarCertPartEvento,
  listarCertPartEvento,
  obterCertPartEventoPorID,
  listarCertificadosDoUsuario,
  baixarCertificado,
} from "../controllers/certificadoPartController.js";

const router = express.Router();

router.get("/usuario/:id_colab", listarCertificadosDoUsuario);
router.get("/download/:nomeArquivo", baixarCertificado);
router.get("/:id", listarCertPartEvento);
router.get("/:id_col/:id_evento", obterCertPartEventoPorID);
router.post("/", criarCertPartEvento);

export default router;
