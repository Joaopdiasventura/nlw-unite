import RegisterAttendeeDto from "../dtos/registerAttendee";
import Attendee from "../models/Attendee";
import AttendeeRepository from "../repository/Attendee";
import { HttpResponse, verifyFields } from "./protocols";

export default class AttendeeController {
	constructor(private readonly repository: AttendeeRepository) {}
	async register(dto: RegisterAttendeeDto): Promise<HttpResponse<Attendee>> {
		try {
			const verified = verifyFields(["name", "email", "eventId"], dto);

			if (verified) return verified;
			const result = await this.repository.register(dto);

			if (typeof result == "string")
				return { statusCode: 400, body: { message: result } };

			return { statusCode: 201, body: result };
		} catch (error) {
			return { statusCode: 500, body: { message: error as string } };
		}
	}
}
