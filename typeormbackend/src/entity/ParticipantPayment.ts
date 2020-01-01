import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {GroupPayment} from "./GroupPayment";
import {ProductSelection} from "./ProductSelection";
import {Participant} from "./Participant";

@Entity()
export class ParticipantPayment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidOn: Date;

  @Column()
  isPaid: boolean;

  @OneToMany(type => ProductSelection, productSelection => productSelection.participantPayment)
  productSelections: ProductSelection[];

  @ManyToOne(type => GroupPayment, groupPayment => groupPayment.participantPayments)
  groupPayment: GroupPayment;

  @ManyToOne(type => Participant, participant => participant.payments)
  payee: Participant;
}
