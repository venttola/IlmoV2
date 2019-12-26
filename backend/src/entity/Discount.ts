import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Discount {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;

}
