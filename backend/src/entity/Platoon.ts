import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import {ParticipantGroup} from "./ParticipantGroup";
import {Event} from "./Event";

@Entity()
export class Platoon {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Event, event => event.platoons)
  event: Event;

  @OneToMany(type => ParticipantGroup, group => group.platoon)
  participantGroups: ParticipantGroup[];
}
