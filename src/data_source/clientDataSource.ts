import { Client } from "../entity";
import { DataSource } from "apollo-datasource";
import { getConnection } from "typeorm";
import { hashData, encryptData } from "../helpers";
import { UserInputError, ValidationError } from "apollo-server";

interface IUserObject {
    email: string;
    name: string;
    password: string;
}

export class ClientDataSource extends DataSource {
    async registerUser(userObject: IUserObject) {
        try {
            const connection = getConnection().getRepository(Client);

            const client = new Client();

            client.email = userObject.email;
            client.name = userObject.name;
            client.password = hashData(userObject.password);
            client.isAdmin = false;

            const { password, id, ...rest } = await connection.save(client);
            const token = await encryptData(id);

            return { ...rest, token };
        } catch (error) {
            throw new ValidationError("E-mail já cadastrado");
        }
    }

    async registerAdmUser(userObject: IUserObject) {
        try {
            const connection = getConnection().getRepository(Client);

            const client = new Client();

            client.email = userObject.email;
            client.name = userObject.name;
            client.password = hashData(userObject.password);
            client.isAdmin = true;

            const { password, id, ...rest } = await connection.save(client);
            const token = await encryptData(id);

            return { ...rest, token };
        } catch (error) {
            throw new ValidationError("E-mail já cadastrado");
        }
    }

    async loginUser(userObject: IUserObject) {
        try {
            const connection = getConnection().getRepository(Client);

            const hashedPass = hashData(userObject.password);

            const { id, ...rest } = await connection.findOneOrFail({
                email: userObject.email,
                password: hashedPass
            });

            const token = await encryptData(id.toString());

            return { ...rest, token };
        } catch (error: any) {
            throw new UserInputError("E-mail ou senha inválidos");
        }
    }

    async checkToken(cliendId: string) {
        try {
            const connection = getConnection();

            const { email, id, password, schedules, ...rest } =
                await connection.manager.findOneOrFail(Client, cliendId);

            return rest;
        } catch (error) {
            throw new UserInputError("Token inválido");
        }
    }
}
