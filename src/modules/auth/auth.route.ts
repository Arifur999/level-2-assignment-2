import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signin);


router.post("/signin", authController.signup);

export const authRoutes = router;
