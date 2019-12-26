import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ParticipantGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
