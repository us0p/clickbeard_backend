import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Barbers } from './'

@Entity()
export class Specialties {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    speciality: string

    @ManyToMany(type => Barbers, barber => barber.specialties)
    barbers: Barbers[]

}