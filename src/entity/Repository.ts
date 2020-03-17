import { Column, Entity, ManyToOne, PrimaryColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Badge } from "./Badge";

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

    @ManyToOne((type) => User, (user) => user.repositories)
    public owner: User;

    @OneToMany((type) => Badge, (badge) => badge.repository)
    public badges: Badge[];
  }
