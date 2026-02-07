import { Router } from "express";
import { createUserController, loginUserController, getUserController, updateUserStatusController, updateUserController, changePasswordController, resetPasswordByAdminController } from "../controllers/user.controller.js";

const router = Router()

router.post('/user', createUserController)
router.post('/login', loginUserController)
router.get('/user', getUserController)
router.patch('/user/:user_id/status', updateUserStatusController)
router.put('/user/:user_id', updateUserController)
router.patch('/user/:user_id/password', changePasswordController)
router.post('/user/:user_id/reset-password', resetPasswordByAdminController)

export default router