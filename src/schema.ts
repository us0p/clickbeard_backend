import { gql } from "apollo-server";

const typeDefs = gql`
    type RegisteredClient {
        token: String
        name: String
        email: String
        isAdmin: Boolean
    }

    type Barbers {
        id: String
        name: String
        age: Int
        hiringDate: String
        specialties: [Speciality]
    }

    type Speciality {
        id: String
        speciality: String
        barbers: [Barbers]
    }

    type Schedule {
        clientName: String
        barberName: String
        scheduledHour: String
        id: String
    }

    type Query {
        login(email: String!, password: String!): RegisteredClient
        listSchedules(clientId: String!): [Schedule]
        checkToken: RegisteredClient
        listSpecialities: [Speciality]
        getBarberFreeTime(barberId: String!, date: String!): [Schedule]
    }

    type Mutation {
        registerClient(
            name: String!
            email: String!
            password: String!
        ): RegisteredClient

        registerAdmUser(
            name: String!
            email: String!
            password: String!
        ): RegisteredClient

        registerSpeciality(speciality: String!): Speciality

        registerBarber(
            name: String!
            age: Int!
            hiringDate: String!
            specialities: [String]!
        ): Barbers

        createSchedule(barberId: String!, scheduledHour: String!): Schedule

        cancelSchedule(scheduleId: String!): String
    }
`;

export default typeDefs;
