import express from "express";
import {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
} from "../controllers/pasien.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRUD Pasien (Master Data)
router.post("/pasien", authenticateToken, createPasien);
router.get("/pasien", authenticateToken, getAllPasien);
router.get("/pasien/:id", authenticateToken, getPasienById);
router.put("/pasien/:id", authenticateToken, updatePasien);
router.delete("/pasien/:id", authenticateToken, deletePasien);

export default router;
