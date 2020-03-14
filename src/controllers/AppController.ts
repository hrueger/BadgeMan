import { Request, Response } from "express";
import { render } from "../utils/utils";

class AppController {
  public static base = async (req: Request, res: Response) => {
    const repositories = (await res.locals.octokit.repos.listForAuthenticatedUser()).data;
    res.send(render("app", {user: req.session.user, repositories}));
  }
}

export default AppController;
