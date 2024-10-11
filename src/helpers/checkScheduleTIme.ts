const checkScheduleTime = (scheduledHour: string) => {
    const scheduleDate = new Date(scheduledHour);
    scheduleDate.setHours(scheduleDate.getHours() - 3);

    const openingTime = new Date(scheduledHour);
    // Convertendo horário para UTC
    openingTime.setHours(8 - 3);
    openingTime.setMinutes(0);
    openingTime.setSeconds(0);
    openingTime.setMilliseconds(0);

    const closingTime = new Date(scheduledHour);
    // Convertendo horário para UTC
    closingTime.setHours(18 - 3);
    closingTime.setMinutes(0);
    closingTime.setSeconds(0);
    closingTime.setMilliseconds(0);

    if (scheduleDate >= openingTime && scheduleDate <= closingTime) {
        return true;
    }

    return false;
};

export default checkScheduleTime;
