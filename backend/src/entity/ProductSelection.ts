import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn} from "typeorm";

import {UserPayment} from "./UserPayment";
import {ParticipantPayment} from "./ParticipantPayment";
import {Product} from "./Product";
import {Discount} from "./Discount";

@Entity()
export class ProductSelection {
 
 @PrimaryGeneratedColumn()
  id: number;
 @ManyToOne(type => UserPayment, userPayment => userPayment.productSelections)
 userPayment: UserPayment;
 @ManyToOne(type => ParticipantPayment, participantPayment => participantPayment.productSelections)
 participantPayment: ParticipantPayment;

 @OneToOne(type: Product)
 @JoinColumn()
 product: Product;

 @OneToOne(type: Discount)
 @JoinColumn()
 discount: Discount
 
}
