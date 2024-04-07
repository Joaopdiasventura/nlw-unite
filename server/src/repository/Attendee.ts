import { GetAttendeesDto, GetAllResponse } from "../dtos/getAttendees";
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

			const existAttendee = await prisma.attendee.findFirst({
				where: { email: dto.email, eventId: dto.eventId },
			});

			if (existAttendee)
				return "Esse email já está cadastrado para esse evento";

			console.log(dto);

			return await prisma.attendee.create({ data: { ...dto } });
		} catch (error) {
			console.log(error);
			return error as any;
		}
	}
	async getAttendees(dto: GetAttendeesDto): Promise<GetAllResponse | string> {
		const { id, page, name } = dto;
		try {
			const event = await prisma.event.findUnique({ where: { id } });

			if (!event) return "Não exite um evento com esse id";

			const attendees: Attendee[] = await prisma.attendee.findMany({
				where: { eventId: id, name: {contains: name} },
				skip: page * 5,
				take: 5,
			});

			const length = await prisma.attendee.count({
				where: { eventId: id },
			});

			for (let i = 0; i < attendees.length; i++) {
				attendees[i].checkedInAt = (
					await prisma.checkIn.findFirst({
						where: {
							attendeeId: attendees[i].id,
							eventId: id,
						},
					})
				)?.createdAt;
			}

			return {
				attendees,
				length,
			};
		} catch (error) {
			return error as string;
		}
	}
}
