import { Octokit } from "@octokit/rest";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export async function isLoggedin(req: Request, res: Response, next: NextFunction) {
    if (req.session.loggedIn && req.session.access_token) {
        res.locals.octokit = new Octokit({
            auth: `bearer ${req.session.access_token}`,
        });
        if (!req.session.user) {
            req.session.user = (await res.locals.octokit.users.getAuthenticated()).data;
        }
        const userRepo = getRepository(User);
        let user = await userRepo.findOne(req.session.user.id, { relations: ["repositories", "repositories.badges"] });
        if (!user) {
            user = new User();
            user.id = req.session.user.id;
            user.username = req.session.user.login;
            user.repositories = [];
            await userRepo.save(user);
        }
        res.locals.user = user;
        next();
    } else {
        res.redirect("/?noSession");
    }
}
