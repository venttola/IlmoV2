import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

import {ParticipantGroup} from "./ParticipantGroup";
import {UserPayment} from "./UserPayment";
import {Organization} from "./Organization";
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  dob: Date;
  
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  allergies: string;

  @Column()
  phone: string;

  @Column()
  passwordResetToken: string

  @Column()
  passwordResetExpires: number;

  @ManyToMany(type => ParticipantGroup, group => group.moderators)
  @JoinTable()
  moderatedGroups: ParticipantGroup[];

  @ManyToMany(type => Organization, organization => organization.members)
  @JoinTable()
  organizations: Organization[];

}
