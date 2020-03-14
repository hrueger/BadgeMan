import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.get("/", AuthController.authorized);

export default router;
