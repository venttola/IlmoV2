import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {Product} from "./Product";
import {Platoon} from "./Platoon";
import {Organization} from "./Organization";

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  description: String

  @Column()
  registerationOpen: boolean;

  @OneToMany(type => Product, product => product.event)
  products: Product[];

  @OneToMany(type => Platoon, platoon => platoon.platoon)
  platoons: Platoon[];

  @ManyToOne(type => Organization, organization => organization.events)
}
