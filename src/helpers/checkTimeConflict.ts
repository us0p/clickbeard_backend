const checkTimeConflict = (
    testingScheduledHour: string,
    registeredScheduledHour: string
) => {
    const testingSchedule = new Date(testingScheduledHour);

    const registeredSchedule = new Date(registeredScheduledHour);

    const registeredScheduleEndingTime = new Date(registeredScheduledHour);

    // Define o espaço de tempo do agendamento para o horário final:
    registeredScheduleEndingTime.setMinutes(
        registeredScheduleEndingTime.getMinutes() + 30
    );

    const previousAvailableScheduleTime = new Date(registeredScheduledHour);

    // Define o horário máximo que uma reserva pode assumir antes da atual:
    previousAvailableScheduleTime.setMinutes(
        previousAvailableScheduleTime.getMinutes() - 30
    );

    if (
        testingSchedule >= registeredSchedule &&
        testingSchedule < registeredScheduleEndingTime
    ) {
        return true;
    }

    if (
        testingSchedule <= registeredSchedule &&
        testingSchedule > previousAvailableScheduleTime
    ) {
        return true;
    }
    return false;
};

export default checkTimeConflict;
