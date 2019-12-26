import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class GroupPayment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidOn: Date;

  @Column()
  referenceNumber: string;

  @Column()
  isPaid: boolean;
}
