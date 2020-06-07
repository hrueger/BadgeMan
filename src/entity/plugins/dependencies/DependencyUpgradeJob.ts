import {
    Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique,
} from "typeorm";
import { User } from "../../system/User";

@Entity()
@Unique(["id"])
export class DependencyUpgradeJob {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public jobId: string;

    @ManyToOne(() => User, (user) => user.dependencyUpgradeJobs)
    public user: User;
}
