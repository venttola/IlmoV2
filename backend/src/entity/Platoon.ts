import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Platoon {
 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
