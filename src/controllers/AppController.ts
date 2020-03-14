import { Request, Response } from "express";

class AppController {
  public static base = async (req: Request, res: Response) => {
    res.send(`Hi, ${req.session.user.login}`);
  }
}

export default AppController;
