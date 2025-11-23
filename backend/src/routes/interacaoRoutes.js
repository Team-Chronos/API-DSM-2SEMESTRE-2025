import express from "express";
import {
  registrarInteracao,
  listarInteracoesCliente,
  listarInteracoesVendedor,
  obterInteracaoPorId,
  atualizarInteracao,
  excluirInteracao,
  obterProximasAcoes,
  obterEstatisticasVendedor,
} from "../controllers/interacaoController.js";

const router = express.Router();

router.post("/", registrarInteracao);
router.get("/cliente/:id_cliente", listarInteracoesCliente);
router.get("/vendedor/:id_vendedor", listarInteracoesVendedor);
router.get("/:id", obterInteracaoPorId);
router.put("/:id", atualizarInteracao);
router.delete("/:id", excluirInteracao);

router.get("/vendedor/:id_vendedor/proximas-acoes", obterProximasAcoes);
router.get("/vendedor/:id_vendedor/estatisticas", obterEstatisticasVendedor);

export default router;
