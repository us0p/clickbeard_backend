import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client, Barbers } from "./";

@Entity()
export class Schedules {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => Barbers, (barber) => barber.schedules)
    barber: Barbers;

    @ManyToOne((type) => Client, (client) => client.schedules)
    client: Client;

    @Column()
    scheduledHour: string;
}
