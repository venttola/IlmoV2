import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  description: String

  @Column()
  registerationOpen: boolean;
}
