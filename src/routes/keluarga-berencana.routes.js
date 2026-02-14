import express from "express";
import {
  getAllKeluargaBerencana,
  getKeluargaBerencanaById,
  createKeluargaBerencana,
  updateKeluargaBerencana,
  deleteKeluargaBerencana,
} from "../controllers/keluarga-berencana.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createKeluargaBerencanaSchema,
  updateKeluargaBerencanaSchema,
} from "../validations/keluarga-berencana.validation.js";

const router = express.Router();

// CRUD Keluarga Berencana
router.post(
  "/keluarga-berencana",
  authenticateToken,
  validate(createKeluargaBerencanaSchema),
  createKeluargaBerencana,
);
router.get("/keluarga-berencana", authenticateToken, getAllKeluargaBerencana);
router.get(
  "/keluarga-berencana/:id",
  authenticateToken,
  getKeluargaBerencanaById,
);
router.put(
  "/keluarga-berencana/:id",
  authenticateToken,
  validate(updateKeluargaBerencanaSchema),
  updateKeluargaBerencana,
);
router.delete(
  "/keluarga-berencana/:id",
  authenticateToken,
  deleteKeluargaBerencana,
);

export default router;
