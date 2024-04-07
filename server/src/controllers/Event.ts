import CreateEventDto from "../dtos/createEvent";
import Event from "../models/Event";
import EventRepository from "../repository/Event";
import { HttpResponse, verifyFields } from "./protocols";

export default class EventController {
	constructor(private readonly repository: EventRepository) {}
	async getAll(): Promise<Event[]> {
		return await this.repository.getAll();
	}
	async create(dto: CreateEventDto): Promise<HttpResponse<Event>> {
		dto.details = dto.details == undefined ? "" : dto.details;
		try {
			const verified = verifyFields(
				["title", "slug", "maximumAttendees"],
				dto,
			);

			if (verified) return verified;

			const result = await this.repository.create(dto);

			if (typeof result == "string")
				return { statusCode: 400, body: { message: result } };

			return {
				statusCode: 201,
				body: result,
			};
		} catch (error) {
			console.log(error);
			return {
				statusCode: 500,
				body: { message: error as string },
			};
		}
	}
}
