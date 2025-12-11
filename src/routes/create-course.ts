import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post("/courses", {
    schema: {
      tags: ['courses'],
      summary: 'Create a new course',
      body: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters long'),
        description: z.string().optional()
      }),
      response: {
        201: z.object({
          id: z.string()
        }).describe('Course created successfully'),
        400: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { title, description } = request.body

    if (!title) {
      return reply.status(400).send({ message: "Title is required" });
    }

    const result = await db.insert(courses).values({
      title,
      description
    }).returning()

    return reply.status(201).send({ id: result[0].id });
  })
}

