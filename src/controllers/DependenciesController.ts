import { Request, Response } from "express";
import * as Bull from "bull";
import { getRepository } from "typeorm";
import { User } from "../entity/system/User";
import { DependencyUpgradeJob } from "../entity/plugins/dependencies/DependencyUpgradeJob";
import { config } from "../config/config";
import { setQueues } from "bull-board";
import * as fs from "fs";


const queue = new Bull("upgradeDependencies", `redis://${config.redisUrl}`);
setQueues(queue);
queue.process(async (job, done) => {
    for (let i = 0; i < 101; i++) {
        job.progress(i);
        for (let j = 0; j < 10000; j++) { }
    }
    done();
});/*
queue.on("progress", (p, x) => {
    console.log(p, x);
}); */

class DependenciesController {
    public static base = async (req: Request, res: Response): Promise<void> => {
        const jobs = await getRepository(DependencyUpgradeJob).find(
            { where: { user: await getRepository(User).findOne(req.params.userId) } },
        );
        let html = "<a href='/dependencies/create'>Create</a><br><br>Jobs:<br>";
        for (const job of jobs) {
            html += `${job.jobId}: ${await (await queue.getJob(job.jobId))?.progress()}    |    Active: ${await (await queue.getJob(job.jobId))?.isActive()}     |    Waiting: ${await (await queue.getJob(job.jobId))?.isWaiting()}     |    Failed: ${await (await queue.getJob(job.jobId))?.isFailed()}<br>`;
            // console.log(await queue.getJob(job.jobId));
        }
        res.send(html);
    };

    public static create = async (req: Request, res: Response): Promise<void> => {
        const j = await queue.add({ d: "myCoolData" });
        const user = await getRepository(User).findOne(req.params.userId);
        const dj = new DependencyUpgradeJob();
        dj.jobId = j.id.toString();
        dj.user = user;
        await getRepository(DependencyUpgradeJob).save(dj);
        res.redirect("/dependencies");
        /*
        queue.on("completed", (job, result) => {
            console.debug(`Job completed with result ${job}`);
        });


        queue.on("progress", (job, progress) => {
            console.debug(`Job progress with result ${job} ${progress}`);
        }); */
    }
}

export default DependenciesController;
