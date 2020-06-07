import { Router } from "express";
import { isLoggedin } from "../middlewares/isLoggedin";
import DependenciesController from "../controllers/DependenciesController";
import { UI } from "bull-board";

const router = Router();

router.get("/", [isLoggedin], DependenciesController.base);
router.get("/create", [isLoggedin], DependenciesController.create);
router.use("/admin", UI);

export default router;
