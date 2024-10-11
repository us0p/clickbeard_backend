import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Schedules } from "./Schedules";

@Entity()
export class Client {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean;

    @OneToMany((type) => Schedules, (schedule) => schedule.client)
    schedules: Schedules[];
}
