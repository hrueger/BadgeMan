import { Request, Response } from "express";
import { getRepository } from "typeorm";
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
      await repositoryRepository.delete({ owner: res.locals.user });
      repositories = (await res.locals.octokit.repos.listForAuthenticatedUser()).data;
      for (const repository of repositories) {
        const r = new Repository();
        r.description = repository.description ? repository.description : "";
        r.name = repository.name;
        r.language = repository.language ? repository.language : "";
        r.id = repository.id;
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
        repositoryRepository.save(r);
      }

      res.redirect("/app");
    } else {
      const repos = res.locals.user.repositories as Repository[];
      for (const repo of repos) {
        let newReadme = repo.readme;
        // badges with surrounding links
        let prevBadge = "";
        let stop = false;
        newReadme = repo.readme.replace(/(\[!\[[^!\]]*\]\([^!\]]*\)\]\([^!\]]*\))/g, (a, t) => {
          if ((repo.readme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "") {
            stop = true;
            return t;
          } else {
            prevBadge = t;
            return "--badgewithurl--";
          }
        });

        prevBadge = "";
        stop = false;
        // badges without surrounding links
        newReadme = newReadme.replace(/(!\[[^!\]]*\]\([^!\)]*\))/g, (a, t) => {
          if ((repo.readme.split(prevBadge)[1].split(t)[0].trim() || stop) && prevBadge != "") {
            return t;
          } else {
            prevBadge = t;
            return "--badge--";
          }
        });

        repo.readme = newReadme;
      }
      res.send(render("app", { user: req.session.user, repositories: repos }));
    }
  }
}

export default AppController;
