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

    @Column({type: "longtext"})
    public readme: string;

    @Column()
    public language: string;

    @ManyToOne((type) => User, (user) => user.repositories)
    public owner: User;

    @OneToMany((type) => Badge, (badge) => badge.repository)
    public badges: Badge[];
  }
