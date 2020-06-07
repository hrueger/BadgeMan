import {
    Column, Entity, ManyToOne, OneToMany, PrimaryColumn,
} from "typeorm";
import { Badge } from "../plugins/readmeBadges/Badge";
import { User } from "./User";

@Entity()
export class Repository {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public readmeAvailable: boolean;

    @Column()
    public language: string;

    @Column()
    public fork: boolean;

    @ManyToOne(() => User, (user) => user.repositories)
    public owner: User;

    @OneToMany(() => Badge, (badge) => badge.repository)
    public badges: Badge[];
}
