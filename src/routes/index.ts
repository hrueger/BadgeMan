import { Router } from "express";
import app from "./app";
import auth from "./auth";
import home from "./home";

const routes = Router();

routes.use("/authorization", auth);
routes.use("/", home);
routes.use("/app", app);

export default routes;
