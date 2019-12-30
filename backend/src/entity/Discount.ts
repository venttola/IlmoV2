import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import {Product} from "./Product";


@Entity()
export class Discount {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;

  @OneToOne(type => Product)
  @JoinColumn()
  product: Product;
}
