import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ParticipantPayment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidOn: Date;

  @Column()
  isPaid: boolean;
}
