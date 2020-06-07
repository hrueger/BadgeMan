import app from "./app";
import auth from "./auth";
import home from "./home";
import { isLoggedin } from "../middlewares/isLoggedin";
import AppController from "../controllers/AppController";
import { Router } from "express";
import dependencies from "./dependencies";

const routes = Router();

routes.use("/authorization", auth);
routes.use("/", home);
routes.use("/app", app);
routes.use("/dependencies", [isLoggedin], dependencies);
routes.get("/settings", [isLoggedin], AppController.settings);

export default routes;
