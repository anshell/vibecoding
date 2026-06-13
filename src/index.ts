import { Elysia } from "elysia";
import { usersRoutes } from "./routes/users-routes";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/health", () => ({ status: "OK", timestamp: new Date() }))
  .use(usersRoutes)
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
