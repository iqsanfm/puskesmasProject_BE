import { Router } from "express";
import {
  createUserController,
  getUserController,
  updateUserStatusController,
  updateUserController,
  changePasswordController,
  resetPasswordByAdminController,
} from "../controllers/user.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Semua endpoint user management hanya bisa diakses oleh ADMIN
router.use(authenticateToken);
router.use(authorizeRole("ADMIN"));

router.post("/users", createUserController);
router.get("/users", getUserController);
router.patch("/users/:user_id/status", updateUserStatusController);
router.put("/users/:user_id", updateUserController);
router.patch("/users/:user_id/password", changePasswordController);
router.post("/users/:user_id/reset-password", resetPasswordByAdminController);

export default router;
