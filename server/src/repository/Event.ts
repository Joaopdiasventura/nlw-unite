import { prisma } from "../services/prisma";
import Event from "../models/Event";
import CreateEventDto from "../dtos/createEvent";

export default class EventRepository {
	async getAll(): Promise<Event[]> {
		return await prisma.event.findMany();
	}
	async create(dto: CreateEventDto): Promise<Event | string> {
		try {
			const existSlug = await prisma.event.findFirst({
				where: { slug: dto.slug },
			});

			if (existSlug) return "Já existe um evento com esse slug";
			return await prisma.event.create({ data: { ...dto } });
		} catch (error) {
			console.log(error);
			return error as any;
		}
	}
}
