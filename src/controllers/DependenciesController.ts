import { Request, Response } from "express";
import * as Bull from "bull";
import { getRepository } from "typeorm";
import { User } from "../entity/system/User";
import { DependencyUpgradeJob } from "../entity/plugins/dependencies/DependencyUpgradeJob";

class DependenciesController {
    public static base = async (req: Request, res: Response): Promise<void> => {
        const queue = new Bull("upgradeDependencies", "redis://192.168.99.100:6379");
        const jobs = await getRepository(DependencyUpgradeJob).find(
            { where: { user: await getRepository(User).findOne(req.params.userId) } },
        );
        let html = "";
        for (const job of jobs) {
            html += `${job.jobId}: ${(await queue.getJob(job.jobId)).progress()}    |    Active: ${(await queue.getJob(job.jobId)).isActive()}     |    Waiting: ${(await queue.getJob(job.jobId)).isWaiting()}     |    Failed: ${(await queue.getJob(job.jobId)).isFailed()}<br>`;
            console.log(await queue.getJob(job.jobId));
        }
        res.send(html);
    };

    public static create = async (req: Request, res: Response): Promise<void> => {
        const queue = new Bull("upgradeDependencies", "redis://192.168.99.100:6379");
        queue.process((j, done) => {
            console.log("processing job");
            let i = 0;
            setTimeout(() => {
                j.progress(i);
                i++;
                if (i > 97) {
                    done();
                }
            }, 100);
        });
        queue.on("progress", (p, x) => {
            console.log(p, x);
        })
        const j = await queue.add("myCoolData");
        const user = await getRepository(User).findOne(req.params.userId);
        const dj = new DependencyUpgradeJob();
        dj.jobId = j.id.toString();
        dj.user = user;
        await getRepository(DependencyUpgradeJob).save(dj);
        res.redirect("/dependencies");
        queue.on('completed', (job, result) => {
            console.debug(`Job completed with result ${job}`);
        });


        queue.on('progress', (job, progress) => {
            console.debug(`Job progress with result ${job} ${progress}`);
        });
    }
}

export default DependenciesController;
