import { Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { Repository } from "./Repository";

@Entity()
@Unique(["id", "username"])
export class User {
  @PrimaryColumn()
  public id: number;

  @Column()
  public username: string;

  @OneToMany(() => Repository, (repository) => repository.owner)
  public repositories: Repository[];
}
