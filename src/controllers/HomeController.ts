import { Request, Response } from "express";
import { render } from "../utils/utils";

class HomeController {
  public static home = async (req: Request, res: Response) => {
    res.send(render("home", {noSession : req.query.noSession == undefined ? false : true}));
  }
}

export default HomeController;
