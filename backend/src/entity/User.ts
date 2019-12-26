import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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
}
