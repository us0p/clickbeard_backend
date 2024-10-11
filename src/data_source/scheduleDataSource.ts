import { DataSource } from "apollo-datasource";
import { Schedules, Client, Barbers } from "../entity";
import { ISchedule, ICancelSchedule } from "../types";
import { getConnection, ILike } from "typeorm";
import { ValidationError, UserInputError } from "apollo-server";
import { checkTimeConflict, filterScheduleData, sort } from "../helpers";

export class ScheduleDataSource extends DataSource {
    async createSchedule(scheduleObject: ISchedule, clientId: string) {
        try {
            const today = new Date();
            // Corrigindo UTC time:
            today.setHours(today.getHours() - 3);

            const scheduleDate = new Date(scheduleObject.scheduledHour);

            if (scheduleDate < today) {
                throw new Error(
                    "Não é possível fazer uma reserva para o passado"
                );
            }

            const connection = getConnection();

            const scheduledDate = scheduleObject.scheduledHour.replace(
                / [0-9]{2}:[0-9]{2}:[0-9]{2} GMT/,
                ""
            );

            const [client, barber, todayBarberSchedules] = await Promise.all([
                connection.manager.findOneOrFail(Client, clientId),
                connection.manager.findOneOrFail(
                    Barbers,
                    scheduleObject.barberId
                ),
                connection.manager.find(Schedules, {
                    where: [
                        {
                            scheduledHour: ILike(`%${scheduledDate}%`),
                            barber: scheduleObject.barberId
                        }
                    ]
                })
            ]);

            if (todayBarberSchedules.length) {
                for (let schedule of todayBarberSchedules) {
                    const hasTimeConflict = checkTimeConflict(
                        scheduleObject.scheduledHour,
                        schedule.scheduledHour
                    );

                    if (hasTimeConflict) {
                        throw new Error("Horário indisponível");
                    }
                }
            }

            const newSchedule = new Schedules();
            newSchedule.client = client;
            newSchedule.barber = barber;
            newSchedule.scheduledHour = scheduleObject.scheduledHour;

            await connection.manager.save(newSchedule);

            return {
                clientName: client.name,
                barberName: barber.name,
                scheduledHour: scheduleObject.scheduledHour
            };
        } catch (error: any) {
            console.log({ error });
            throw new ValidationError(error.message);
        }
    }

    async cancelSchedule(
        cancelScheduleObject: ICancelSchedule,
        clientId: string
    ) {
        try {
            const today = new Date();
            // Corrigindo UTC time:
            today.setHours(today.getHours() - 3);

            const connection = getConnection();

            const schedule = await connection.manager.findOneOrFail(
                Schedules,
                cancelScheduleObject.scheduleId,
                {
                    relations: ["client"]
                }
            );

            if (schedule.client.id.toString() !== clientId) {
                throw new Error(
                    "Não é possível cancelar a reserva da outro usuário"
                );
            }

            const scheduleHour = new Date(schedule.scheduledHour);
            scheduleHour.setHours(scheduleHour.getHours() - 2);

            if (today < scheduleHour) {
                await connection.manager.remove(schedule);
                return "Agendamento cancelado";
            }

            throw new Error(
                "Cancelamento válido apenas com aviso prévio de 2 horas."
            );
        } catch (error: any) {
            if (error.message.includes("Cancelamento válido")) {
                throw new ValidationError(error.message);
            }

            if (error.message.includes("matching")) {
                throw new UserInputError("Agendamento não encontrado");
            }

            throw new UserInputError(error.message);
        }
    }

    async listSchedules(clientId: string) {
        try {
            const connection = getConnection();

            const client = await connection.manager.findOneOrFail(
                Client,
                clientId
            );

            if (client.isAdmin) {
                const schedules = await connection.manager.find(Schedules, {
                    relations: ["barber", "client"]
                });

                return filterScheduleData(schedules);
            }

            const schedules = await connection.manager.find(Schedules, {
                where: [{ client: { id: clientId } }],
                relations: ["barber", "client"]
            });

            return filterScheduleData(schedules);
        } catch (error: any) {
            console.log({ error });
            throw new Error(error.message);
        }
    }
    async getBarberFreeTime(date: string, barberId: string) {
        try {
            const today = new Date();
            // Corrigindo UTC time:
            today.setHours(today.getHours() - 3);

            const scheduleDate = new Date(date);

            if (scheduleDate < today) {
                throw new Error("Dados passados indisponívels.");
            }

            const connection = getConnection();

            const scheduledDate = date.replace(
                / [0-9]{2}:[0-9]{2}:[0-9]{2} GMT/,
                ""
            );

            const schedules = await connection.manager.find(Schedules, {
                where: [
                    {
                        scheduledHour: ILike(`%${scheduledDate}%`),
                        barber: barberId
                    }
                ]
            });

            return schedules.sort(sort);
        } catch (error: any) {
            throw new UserInputError(error.message);
        }
    }
}
