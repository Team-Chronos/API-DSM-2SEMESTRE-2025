import express from "express";
import multer from "multer";
import {
  registrarChecklistPredial,
  listarChecklistsPredial,
  listarChecklistPredialPorId,
} from "../controllers/checklistPredialController.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.none(), registrarChecklistPredial);

router.get("/", listarChecklistsPredial);

router.get("/:id", listarChecklistPredialPorId);

export default router;
