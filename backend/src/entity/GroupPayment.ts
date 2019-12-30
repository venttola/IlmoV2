import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn} from "typeorm";
import {ParticipantGroup} from "./ParticipantGroup";
import {UserPayment} from "./UserPayment";
import {ParticipantPayment} from "./ParticipantPayment";

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

  @OneToOne(type => ParticipantGroup)
  @JoinColumn()
  payee: ParticipantGroup

  @OneToMany(type => UserPayment, userPayment => userPayment.groupPayment)
  userPayments: UserPayment[];

  @OneToMany(type => ParticipantPayment, participantPayment => participantPayment.groupPayment)
  participantPayments: UserPayment[];
}
