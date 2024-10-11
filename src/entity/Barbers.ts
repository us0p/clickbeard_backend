import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany
} from "typeorm";
import { Specialties, Schedules } from "./";

@Entity()
export class Barbers {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    age: number;

    @Column()
    hiringDate: string;

    @ManyToMany((type) => Specialties, (specialites) => specialites.barbers)
    @JoinTable()
    specialties: Specialties[];

    @OneToMany((type) => Schedules, (schedule) => schedule.barber)
    schedules: Schedules[];
}
