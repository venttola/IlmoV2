import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, ManyToMany} from "typeorm";

import {GroupPayment} from "./GroupPayment";
import {Platoon} from "./Platoon";
import {User} from "./User";
@Entity()
export class ParticipantGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToOne(type => GroupPayment)
  groupPayment: GroupPayment;

  @ManyToOne(type => Platoon, platoon => platoon.participantGroups)
  platoon: Platoon;

  @ManyToMany(type => User, user => user.moderatedGroups)
  moderators: User[];
}
