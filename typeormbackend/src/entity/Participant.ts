import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ParticipantPayment} from "./ParticipantPayment";
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

  @OneToMany(type => ParticipantPayment, payment => payment.payee)
  payments: ParticipantPayment[];

}
