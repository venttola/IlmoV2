import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Event} from "./Event";
import {Discount} from "./Discount";
@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Event, event => event.products)
  event: Event;

  @OneToMany(type => Discount, discount => discount.product)
  discounts: Discount[];
}
