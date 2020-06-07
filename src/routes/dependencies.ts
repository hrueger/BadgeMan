import { Router } from "express";
import { isLoggedin } from "../middlewares/isLoggedin";
import DependenciesController from "../controllers/DependenciesController";

const router = Router();

router.get("/", [isLoggedin], DependenciesController.base);
router.get("/create", [isLoggedin], DependenciesController.create);

export default router;
