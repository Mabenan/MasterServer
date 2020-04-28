import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  adress: string;

  @Column()
  port: number

  @Column()
  map: string;

  @Column('datetime')
  heartbeat: Date;
  
}