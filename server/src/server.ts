import { FastifyInstance } from "fastify";
import app from "./app";

async function main(app: FastifyInstance) {
	try {
		const port = parseInt(process.env.PORT || "3000");

		await app.listen({ port, host: "0.0.0.0" }).then(() => {
			console.log(`Server is running at port: ${port}`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

main(app);
