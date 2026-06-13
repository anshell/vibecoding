import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const registerUser = async (data: typeof users.$inferInsert) => {
  // Periksa apakah email sudah terdaftar
  const existingUser = await db.select().from(users).where(eq(users.email, data.email));
  if (existingUser.length > 0) {
    return { error: "Email sudah terdaftar" };
  }

  // Hash password menggunakan Bun.password (menggunakan algoritma argon2/bcrypt secara otomatis)
  const hashedPassword = await Bun.password.hash(data.password);

  // Simpan data user ke database
  await db.insert(users).values({
    ...data,
    password: hashedPassword,
  });

  return { data: "OK" };
};

export const loginUser = async (data: Pick<typeof users.$inferInsert, "name" | "email" | "password">) => {
  // Cari user berdasarkan email
  const userList = await db.select().from(users).where(eq(users.email, data.email));
  const user = userList[0];
  if (!user) {
    return { error: "Email atau password salah" };
  }

  // Verifikasi kecocokan password
  const isMatch = await Bun.password.verify(data.password, user.password);
  if (!isMatch) {
    return { error: "Email atau password salah" };
  }

  // Jika nama yang diinput saat login juga harus cocok (opsional berdasarkan spesifikasi issue)
  if (user.name !== data.name) {
    return { error: "Kredensial tidak cocok" };
  }

  return { data: "OK" };
};
