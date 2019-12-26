import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProductSelection {
 
 @PrimaryGeneratedColumn()
  id: number;
}
