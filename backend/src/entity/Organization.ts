import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from "typeorm";
import {Event} from "./Event";
import {User} from "./User";
@Entity()
export class Organization {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  bankAccount: string;

  @OneToMany(type => Event, event => event.organization)
  events: Event[];

  @ManyToMany(type => User, user => user.organizations)
  members: User[];
}
