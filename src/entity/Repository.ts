import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

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
  }
