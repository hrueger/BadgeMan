import { Octokit } from "@octokit/rest";
import { NextFunction, Request, Response } from "express";

export async function isLoggedin(req: Request, res: Response, next: NextFunction) {
  if (req.session.loggedIn && req.session.access_token) {
    res.locals.octokit = new Octokit({
      auth: `bearer ${req.session.access_token}`,
    });
    if (!req.session.user) {
      req.session.user = (await res.locals.octokit.users.getAuthenticated()).data;
    }
    next();
  } else {
    res.redirect("/");
  }
}
