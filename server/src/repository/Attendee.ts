import RegisterAttendeeDto from "../dtos/registerAttendee";
import Attendee from "../models/Attendee";
import { prisma } from "../services/prisma";

export default class AttendeeRepository {
	async register(dto: RegisterAttendeeDto): Promise<Attendee | string> {
		try {
			const event = await prisma.event.findUnique({
				where: { id: dto.eventId },
			});

			if (!event) return "Não exite um evento com esse id";

			const count = await prisma.attendee.count({
				where: {
					eventId: dto.eventId,
				},
			});

			if (event.maximumAttendees && count >= event.maximumAttendees)
				return "O evento já está na capacidade máxima";

			const existAttendee = await prisma.attendee.findUnique({
				where: { email: dto.email, eventId: dto.eventId },
			});

			if (existAttendee)
				return "Esse email já está cadastrado para esse evento";

			return await prisma.attendee.create({ data: { ...dto } });
		} catch (error) {
			console.log(error);
			return error as any;
		}
	}
}
