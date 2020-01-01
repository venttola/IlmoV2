import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {GroupPayment} from "./GroupPayment";
import {ProductSelection} from "./ProductSelection";
@Entity()
export class UserPayment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paidOn: Date;

  @Column()
  isPaid: boolean;

  @OneToMany(type => ProductSelection, productSelection => productSelection.userPayment)
  productSelections: ProductSelection[];

  @ManyToOne(type => GroupPayment, groupPayment => groupPayment.participantPayments)
  groupPayment: GroupPayment;

}
