import fastify from "fastify";
import crypto from "node:crypto";

import { db } from "./database/client.ts";
import { courses } from './database/schema.ts'
import { eq } from "drizzle-orm";

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      }
    }
  }
});

const PORT = 3000;

server.get("/api/health", async () => {
  return { status: "ok" };
});

server.get("/api/courses", async (request, reply) => {
  const result = await db.select({
    id: courses.id,
    title: courses.title
  }).from(courses);

  return reply.send({ courses: result });
})

server.post("/api/courses", async (request, reply) => {
  type Body = typeof courses.$inferInsert

  const { title, description } = request.body as Body;

  if (!title) {
    return reply.status(400).send({ message: "Title is required" });
  }

  const result = await db.insert(courses).values({
    title,
    description
  }).returning()

  return reply.status(201).send({ id: result[0].id });
})

server.get("/api/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  }

  const { id } = request.params as Params;

  const result = await db.select().from(courses).where(eq(courses.id, id))

  if (result.length <= 0) {
    return reply.status(404).send({ message: "Course not found" });
  }

  return reply.send({ course: result[0] });
})

server.listen({ port: PORT }).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});