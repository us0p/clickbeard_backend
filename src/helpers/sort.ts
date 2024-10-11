import { Schedules } from "../entity";
import { IMappedSchedule } from "../types";

const sort = (
    a: Schedules | IMappedSchedule,
    b: Schedules | IMappedSchedule
) => {
    const newDateA = new Date(a.scheduledHour);
    const newDateB = new Date(b.scheduledHour);

    if (newDateA < newDateB) {
        return -1;
    }

    if (newDateA > newDateB) {
        return 1;
    }

    return 0;
};

export default sort;
