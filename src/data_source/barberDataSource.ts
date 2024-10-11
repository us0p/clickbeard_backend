import { DataSource } from "apollo-datasource";
import { getConnection } from "typeorm";
import { Barbers, Specialties, Client } from "../entity";
import { UserInputError, ForbiddenError } from "apollo-server";
import { IBarberResgistry } from "../types";

export class BarberDataSource extends DataSource {
    async registerBarber(barberObject: IBarberResgistry, clientId: string) {
        try {
            const connection = getConnection();

            const client = await connection.manager.findOneOrFail(
                Client,
                clientId
            );

            if (!client.isAdmin) {
                throw new Error("Usuário não possui permissão para essa rota");
            }

            const speciality = await Promise.all(
                barberObject.specialities.map(async (id) =>
                    connection.manager.findOneOrFail(Specialties, { id })
                )
            );

            const newBarber = new Barbers();
            newBarber.age = barberObject.age;
            newBarber.hiringDate = barberObject.hiringDate;
            newBarber.name = barberObject.name;
            newBarber.specialties = speciality;

            return await connection.manager.save(newBarber);
        } catch (error: any) {
            if (error.message.includes("Usuário")) {
                throw new ForbiddenError(error.message);
            }
            throw new UserInputError("Especialidade não encontrada");
        }
    }
}
