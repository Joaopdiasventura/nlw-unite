import { FastifyInstance } from "fastify";
import RegisterAttendeeDto from "../dtos/registerAttendee";
import AttendeeRepository from "../repository/Attendee";
import AttendeeController from "../controllers/Attendee";

export default async function AttendeeRoute(
	app: FastifyInstance,
): Promise<void> {
	const repository = new AttendeeRepository();
	const controller = new AttendeeController(repository);
	app.post("/", async (request, reply) => {
		try {
			const Body = request.body as RegisterAttendeeDto;

			const { statusCode, body } = await controller.register(Body);

			return reply.status(statusCode).send(body);
		} catch (error) {
			return reply.status(500).send(error);
		}
	});
}
