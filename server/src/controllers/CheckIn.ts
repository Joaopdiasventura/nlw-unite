import CheckInDto from "../dtos/CheckIn";
import CheckIn from "../models/CheckIn";
import CheckInRepository from "../repository/CheckIn";
import { HttpResponse, verifyFields } from "./protocols";

export default class CheckInController {
	constructor(private readonly repository: CheckInRepository) {}
	async check(dto: CheckInDto): Promise<HttpResponse<CheckIn>> {
		try {
			const verified = verifyFields(["attendeeEmail", "eventId"], dto);

			if (verified) return verified;

			const result = await this.repository.check(dto);

			if (typeof result == "string")
				return {
					statusCode: 400,
					body: { message: result },
				};

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
