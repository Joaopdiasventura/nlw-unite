import { FastifyInstance } from "fastify";
import CheckInRepository from "../repository/CheckIn";
import CheckInController from "../controllers/CheckIn";
import CheckInDto from "../dtos/CheckIn";

export default async function CheckInRoute(app: FastifyInstance): Promise<void> {
	const repository = new CheckInRepository();
	const controller = new CheckInController(repository);
	app.post("/", async (request, reply) => {
		const Body = request.body as CheckInDto;

		try {
			const { statusCode, body } = await controller.check(Body);

			return reply.status(statusCode).send(body);
		} catch (error) {
			console.log(error);
			return reply.status(500).send(error);
		}
	});
}