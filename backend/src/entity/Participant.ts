import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Participant {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @Column()
  allergies: string;
}
