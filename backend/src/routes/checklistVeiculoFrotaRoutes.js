import express from "express";
import {
  listarChecklistFrotaPorId,
  listarChecklistsVeiculoFrota,
  listarMotoristas,
  registrarChecklistFrota,
} from "../controllers/checklistVeiculoFrotaController.js";

const router = express.Router();

router.post("/", registrarChecklistFrota);
router.get("/", listarChecklistsVeiculoFrota);
router.get("/motoristas", listarMotoristas);
router.get("/:id", listarChecklistFrotaPorId);

export default router;
