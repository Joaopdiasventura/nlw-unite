import fastify from "fastify";
import cors from "@fastify/cors";

import EventRoute from "./routes/Event";
import AttendeeRoute from "./routes/Attendee";
import CheckInRoute from "./routes/CheckIn";

const app = fastify();

const corsOptions = {
	origin: process.env.FRONTEND,
	methods: ["GET", "DELETE", "POST", "PUT"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.register(cors, corsOptions);

app.register(EventRoute, { prefix: "/event" });
app.register(AttendeeRoute, { prefix: "/attendee" });
app.register(CheckInRoute, { prefix: "/check" });

export default app;
