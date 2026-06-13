import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/health", () => ({ status: "OK", timestamp: new Date() }))
  .get("/users", async () => {
    try {
      return await db.select().from(users);
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .post("/users", async ({ body }) => {
    try {
      await db.insert(users).values({
        name: body.name,
        email: body.email,
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
    })
  })
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
