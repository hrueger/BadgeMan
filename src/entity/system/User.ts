import {
    Column, Entity, OneToMany, PrimaryColumn, Unique,
} from "typeorm";
import { Repository } from "./Repository";
import { DependencyUpgradeJob } from "../plugins/dependencies/DependencyUpgradeJob";

@Entity()
@Unique(["id", "username"])
export class User {
    @PrimaryColumn()
    public id: number;

    @Column()
    public username: string;

    @OneToMany(() => Repository, (repository) => repository.owner)
    public repositories: Repository[];

    @OneToMany(() => DependencyUpgradeJob, (dependencyUpgradeJob) => dependencyUpgradeJob.user)
    public dependencyUpgradeJobs: DependencyUpgradeJob[];
}
