import { FastifyInstance } from "fastify";
import EventController from "../controllers/Event";
import EventRepository from "../repository/Event";
import CreateEventDto from "../dtos/createEvent";

export default async function EventRoute(app: FastifyInstance): Promise<void> {
	const repository = new EventRepository();
	const controller = new EventController(repository);

	app.get("/", async (request, reply) => {
		const result = await controller.getAll();

		return reply.send(result);
	});

	app.post("/", async (request, reply) => {
		const Body = request.body as CreateEventDto;

		try {
			const { statusCode, body } = await controller.create(Body);

			return reply.status(statusCode).send(body);
		} catch (error) {
			return reply.status(500).send(error);
		}
	});
}
