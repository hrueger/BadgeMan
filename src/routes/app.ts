import { Router } from "express";
import AppController from "../controllers/AppController";
import { isLoggedin } from "../middlewares/isLoggedin";

const router = Router();

router.get("/", [isLoggedin], AppController.base);

export default router;
