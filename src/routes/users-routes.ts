import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../service/users-service";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .post("/", async ({ body, set }) => {
    const result = await registerUser(body);
    if (result.error) {
      set.status = 400; // Bad Request
    }
    return result;
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      username: t.String(),
      password: t.String()
    })
  })
  .post("/login", async ({ body, set }) => {
    const result = await loginUser(body);
    if (result.error) {
      set.status = 401; // Unauthorized
    }
    return result;
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String()
    })
  });
