import { Router } from "express";
import { createUserController } from "../controllers/user.controller.js";

const router = Router()

router.post('/user', createUserController)

export default router