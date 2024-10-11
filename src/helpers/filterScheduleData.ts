import { Schedules } from "../entity";
import sort from "./sort";

const filterScheduleData = (schedules: Schedules[]) => {
    const mappedData = schedules.map((schedule) => {
        return {
            scheduledHour: schedule.scheduledHour,
            barberName: schedule.barber.name,
            clientName: schedule.client.name,
            id: schedule.id
        };
    });

    mappedData.sort(sort);

    return mappedData;
};

export default filterScheduleData;
