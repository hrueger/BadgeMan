import { Router } from "express";
import auth from "./auth";
import home from "./home";
import user from "./user";

const routes = Router();

routes.use("/auth", auth);
routes.use("/", home);

export default routes;
