import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { join } from "path";
import { config } from "dotenv";
import {
    ClientDataSource,
    SpecialityDataSource,
    BarberDataSource,
    ScheduleDataSource
} from "./data_source";
import startKeyStore from "./services/startKeyStore";
import { decryptData } from "./helpers";
import { createDatabase } from "typeorm-extension";

config({ path: join(__dirname, "../env") });

startKeyStore();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            clientController: new ClientDataSource(),
            specialityController: new SpecialityDataSource(),
            barberController: new BarberDataSource(),
            scheduleController: new ScheduleDataSource()
        };
    },
    context: async ({ req }) => {
        try {
            const token = req.headers.authorization || "";

            if (token) {
                const clientId = await decryptData(token);

                return { clientId };
            }

            return { clientId: null };
        } catch (error) {
            console.log({ error });
        }
    }
});

server.listen().then(async ({ url }) => {
    try {
        const connecitonOptions = await getConnectionOptions();
        await createDatabase({ ifNotExist: true }, connecitonOptions);

        await createConnection();
        console.log("db connected!");
        console.log(`Server started ad ${url}`);
    } catch (error) {
        console.log(error);
    }
});
