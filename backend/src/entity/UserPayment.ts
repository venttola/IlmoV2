import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class UserPayment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidOn: Date;

  @Column()
  isPaid: boolean;
}
