import express from "express";
import {
  createHealthDataController,
  getAllHealthDataController,
  getHealthDataByIdController,
  updateHealthDataController,
  reviseHealthDataController,
  deleteHealthDataController,
  approveHealthDataController,
  rejectHealthDataController,
  getPendingHealthDataController,
  getRejectedHealthDataController,
} from "../controllers/healthData.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRUD Health Data - Semua user yang terautentikasi bisa akses
// Logic filtering berdasarkan role/position ada di service layer
router.post("/health-data", authenticateToken, createHealthDataController);
router.get("/health-data", authenticateToken, getAllHealthDataController);
router.get(
  "/health-data/:data_id",
  authenticateToken,
  getHealthDataByIdController,
);
router.put(
  "/health-data/:data_id",
  authenticateToken,
  updateHealthDataController,
);
router.delete(
  "/health-data/:data_id",
  authenticateToken,
  deleteHealthDataController,
);

// Revision - Bidan praktik revisi data yang ditolak
router.put(
  "/health-data/:data_id/revise",
  authenticateToken,
  reviseHealthDataController,
);

// Verification - Bidan desa/koordinator approve/reject
router.patch(
  "/health-data/:data_id/approve",
  authenticateToken,
  approveHealthDataController,
);
router.patch(
  "/health-data/:data_id/reject",
  authenticateToken,
  rejectHealthDataController,
);

// Special Endpoints
router.get(
  "/health-data-pending",
  authenticateToken,
  getPendingHealthDataController,
);
router.get(
  "/health-data-rejected",
  authenticateToken,
  getRejectedHealthDataController,
);

export default router;
