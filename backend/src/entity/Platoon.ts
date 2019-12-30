import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import {ParticipantGroup} from "./ParticipantGroup";
@Entity()
export class Platoon {
 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => ParticipantGroup, group => group.platoon)
  participantGroups: ParticipantGroup[];
}
