import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { ilike, asc, SQL, and } from "drizzle-orm";

import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses", {
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['id', 'title']).optional().default('title'),
        page: z.coerce.number().optional().default(1),
      }),
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.string(),
            title: z.string()
          })),
          total: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { search, orderBy, page } = request.query

    const conditions: SQL[] = []

    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [result, totalCount] = await Promise.all([
      db.select({
        id: courses.id,
        title: courses.title
      })
        .from(courses)
        .where(
          and(...conditions)
        )
        .orderBy(asc(courses[orderBy]))
        .limit(10)
        .offset((page - 1) * 10),
      db.$count(courses, and(...conditions))
    ]
    )

    return reply.send({ courses: result, total: totalCount });
  })
}
