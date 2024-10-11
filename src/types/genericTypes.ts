export interface IBarberResgistry {
    age: number;
    hiringDate: string;
    name: string;
    specialities: string[];
}

export interface ISchedule {
    barberId: string;
    scheduledHour: string;
}

export interface ICancelSchedule {
    scheduleId: string;
}

export interface IListSchedule {
    clientId: string;
}

export interface IGetBarberFreeTime {
    date: string;
    barberId: string;
}

export interface IMappedSchedule {
    scheduledHour: string;
    barberName: string;
    clientName: string;
    id: string;
}
