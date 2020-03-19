import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Repository } from "./Repository";

@Entity()
@Unique(["id"])
export class Badge {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public src: string;

  @Column()
  public alt: string;

  @Column({nullable: true})
  public href: string;

  @ManyToOne(() => Repository, (repository) => repository.badges)
  public repository: Repository;

  public additionalInfo?: any;
}
