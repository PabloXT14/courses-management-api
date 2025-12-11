import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const getCourseById: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses/:id", {
    schema: {
      tags: ['courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.uuid()
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().nullable()
          })
        }),
        404: z.object({
          message: z.string()
        }).describe('Course not found')
      }
    }
  }, async (request, reply) => {

    const { id } = request.params

    const result = await db.select().from(courses).where(eq(courses.id, id))

    if (result.length <= 0) {
      return reply.status(404).send({ message: "Course not found" });
    }

    return reply.send({ course: result[0] });
  })

}