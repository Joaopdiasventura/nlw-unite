import CheckInDto from "../dtos/CheckIn";
import CheckIn from "../models/CheckIn";
import { prisma } from "../services/prisma";

export default class CheckInRepository {
	async check(dto: CheckInDto): Promise<CheckIn | string> {
		try {
			const attendee = await prisma.attendee.findUnique({
				where: { email: dto.attendeeEmail, eventId: dto.eventId },
			});

			if (!attendee) return "Esse email não está cadastrado no sistema";

			const event = await prisma.event.findUnique({
				where: { id: dto.eventId },
			});

			if (!event) return "Não existe um evento com esse id";

			const alredyCheckd = await prisma.checkIn.findFirst({
				where: { ...dto },
			});

			if (alredyCheckd)
				return "Usuário já realizou o check-in para esse evento";

			return await prisma.checkIn.create({ data: { ...dto } });
		} catch (error) {
			console.log(error);
			return error as string;
		}
	}
	async getCheckIns(id: string): Promise<CheckIn[] | string> {
		try {
			const event = await prisma.event.findUnique({ where: { id } });

			if (!event) return "Não exite um evento com esse id";

			return await prisma.checkIn.findMany({ where: { eventId: id } });
		} catch (error) {
			return error as string;
		}
	}
}
