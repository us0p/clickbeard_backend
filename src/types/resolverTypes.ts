import {
    ClientDataSource,
    SpecialityDataSource,
    BarberDataSource,
    ScheduleDataSource
} from "../data_source";

export interface IDataSource {
    dataSources: {
        clientController: ClientDataSource;
        specialityController: SpecialityDataSource;
        barberController: BarberDataSource;
        scheduleController: ScheduleDataSource;
    };
    clientId: string | null;
}
