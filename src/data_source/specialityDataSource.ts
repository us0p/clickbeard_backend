import { DataSource } from "apollo-datasource";
import { getConnection } from "typeorm";
import { Specialties, Client } from "../entity";
import { ForbiddenError, ValidationError } from "apollo-server";

export class SpecialityDataSource extends DataSource {
    async registerSpeciality(speciality: string, clientId: string) {
        try {
            const connection = getConnection();

            const client = await connection.manager.findOneOrFail(
                Client,
                clientId
            );

            if (!client.isAdmin) {
                throw new Error("Usuário não possui permissão para essa rota");
            }

            const newSpeciality = new Specialties();
            newSpeciality.speciality = speciality;

            const specialityCreated = await connection.manager.save(
                newSpeciality
            );

            return specialityCreated;
        } catch (error: any) {
            console.log({ error });

            if (error.message.includes("Duplicate")) {
                throw new ValidationError("Especialidade já registrada");
            }
            throw new ForbiddenError(error.message);
        }
    }

    async listSpecialities() {
        try {
            const connection = getConnection();
            const specialities = await connection.manager.find(Specialties, {
                relations: ["barbers"]
            });

            return specialities;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
