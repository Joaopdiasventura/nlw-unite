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
		const Body = request.body as RegisterAttendeeDto;
		try {
			const { statusCode, body } = await controller.register(Body);

			return reply.status(statusCode).send(body);
		} catch (error) {
			return reply.status(500).send(error);
		}
	});
	app.get("/:eventId", async (request, reply) => {
		const { eventId } = request.params as RegisterAttendeeDto;
		try {
			const { statusCode, body } = await controller.getAttendees(eventId);

			return reply.status(statusCode).send(body);
		} catch (error) {
			return reply.status(500).send(error);
		}
	});
}
