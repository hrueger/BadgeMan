import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Badge } from "../entity/Badge";
import { Repository } from "../entity/Repository";
import { User } from "../entity/User";
import { render } from "../utils/utils";

class AppController {
  public static base = async (req: Request, res: Response) => {
    let repositories;
    if (req.query.refresh != undefined) {
      res.locals.user.repositories = [];
      getRepository(User).save(res.locals.user);
      const repositoryRepository = getRepository(Repository);
      const badgeRepository = getRepository(Badge);
      const reposToDelete = await repositoryRepository.find({owner: res.locals.user});
      for (const r of reposToDelete) {
        r.badges = [];
        await repositoryRepository.save(r);
        await repositoryRepository.delete(r.id);
      }
      repositories = (await res.locals.octokit.repos.listForAuthenticatedUser()).data;
      for (const repository of repositories) {
        let r = new Repository();
        r.description = repository.description ? repository.description : "";
        r.name = repository.name;
        r.language = repository.language ? repository.language : "";
        r.id = repository.id;
        r.fork = repository.fork;
        r.badges = [];
        try {
          r.readme = (await res.locals.octokit.repos.getReadme({
            headers: { accept: "application/vnd.github.v3.raw" },
            owner: res.locals.user.username,
            repo: repository.name,
          })).data;
          console.log(`got readme of ${res.locals.user.username}/${repository.name}`);
        } catch (e) {
          console.log(`didn't find readme of ${res.locals.user.username}/${repository.name}`);
          r.readme = "";
        }
        r.owner = res.locals.user;
        r = await repositoryRepository.save(r);

        let newReadme = r.readme;
        // badges with surrounding links
        let prevBadge = "";
        let stop = false;
        let stoppedAt;
        newReadme = r.readme.replace(/(\[!\[[^!\]]*\]\([^!\]]*\)\]\([^!\]]*\))/g, (a, t) => {
          if ((r.readme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "") {
            stop = true;
            stoppedAt = r.readme.indexOf(t);
            return t;
          } else {
            prevBadge = t;
            t = t.replace("[![", "");
            const u = t.split("](");
            u[1] = u[1].substr(0, u[1].length - 1);
            u[2] = u[2].substr(0, u[2].length - 1);
            const b = new Badge();
            b.alt = u[0];
            b.src = u[1];
            b.href = u[2];
            b.repository = r;
            badgeRepository.save(b);
            return "--badgewithurl--";
          }
        });

        prevBadge = "";
        stop = false;
        // badges without surrounding links
        newReadme = newReadme.replace(/(!\[[^!\]]*\]\([^!\)]*\))/g, (a, t) => {
          if (
            (!stoppedAt || newReadme.indexOf(t) > stoppedAt) ||
            ((r.readme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "")) {
            return t;
          } else {
            prevBadge = t;
            t = t.replace("![", "");
            const u = t.split("](");
            u[1] = u[1].substr(0, u[1].length - 1);
            console.log(u);
            const b = new Badge();
            b.src = u[1];
            b.alt = u[0];
            b.repository = r;
            badgeRepository.save(b);
            return "--badge--";
          }
        });

      }

      res.redirect("/app");
    } else {
      res.send(render("app", { user: req.session.user, repositories: res.locals.user.repositories }));
    }
  }
}

export default AppController;
