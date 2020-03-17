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
        let repoReadme = "";
        try {
          repoReadme = (await res.locals.octokit.repos.getReadme({
            headers: { accept: "application/vnd.github.v3.raw" },
            owner: res.locals.user.username,
            repo: repository.name,
          })).data;
          r.readmeAvailable = true;
          console.log(`got readme of ${res.locals.user.username}/${repository.name}`);
        } catch (e) {
          console.log(`didn't find readme of ${res.locals.user.username}/${repository.name}`);
          r.readmeAvailable = false;
        }
        r.owner = res.locals.user;
        r = await repositoryRepository.save(r);

        // badges with surrounding links
        let prevBadge = "";
        let stop = false;
        let stoppedAt;
        repoReadme = repoReadme.replace(/(\[!\[[^!\]]*\]\([^!\]]*\)\]\([^!\]]*\))/g, (a, t) => {
          if ((repoReadme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "") {
            stop = true;
            stoppedAt = repoReadme.indexOf(t);
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
        repoReadme = repoReadme.replace(/(!\[[^!\]]*\]\([^!\)]*\))/g, (a, t) => {
          if (
            (!stoppedAt || repoReadme.indexOf(t) > stoppedAt) ||
            ((repoReadme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "")) {
            return t;
          } else {
            prevBadge = t;
            t = t.replace("![", "");
            const u = t.split("](");
            u[1] = u[1].substr(0, u[1].length - 1);
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
