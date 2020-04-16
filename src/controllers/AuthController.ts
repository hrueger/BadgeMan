import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../config/config";

class AuthController {

    public static authorized = async (req: Request, res: Response) => {
        const requestToken = req.query.code;
        fetch(`https://github.com/login/oauth/access_token?client_id=${config.clientID}&client_secret=${config.clientSecret}&code=${requestToken}`, {
            headers: {
                Accept: "application/json",
            },
            method: "post",
        }).then((response) => response.json())
            .then((response) => {
                if (response.access_token) {
                    req.session.loggedIn = true;
                    req.session.access_token = response.access_token;
                    res.redirect("/app");
                } else {
                    res.send(`Unknown error: ${JSON.stringify(response)}`);
                }
            });
    }
}
export default AuthController;
