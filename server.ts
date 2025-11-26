import fastify from "fastify";
import crypto from "node:crypto";

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

const courses = [
  { id: "1", name: "Node.js Basics" },
  { id: "2", name: "Advanced JavaScript" },
  { id: "3", name: "MongoDB Basics" },
]

server.get("/api/health", async () => {
  return { status: "ok" };
});

server.get("/api/courses", async (request, reply) => {
  return reply.send({ courses });
})

server.post("/api/courses", async (request, reply) => {
  type Body = {
    name: string;
  }

  const { name } = request.body as Body;

  if (!name) {
    return reply.status(400).send({ message: "Name is required" });
  }

  const newCourse = {
    id: crypto.randomUUID(),
    name
  }

  courses.push(newCourse);

  return reply.status(201).send({ id: newCourse.id });
})

server.get("/api/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  }

  const { id } = request.params as Params;

  const course = courses.find(course => course.id === id);

  if (!course) {
    return reply.status(404).send({ message: "Course not found" });
  }

  return reply.send({ course });
})

server.listen({ port: PORT }).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});