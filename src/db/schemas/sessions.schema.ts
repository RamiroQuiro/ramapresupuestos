import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./users.schema";

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
