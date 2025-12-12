import fastify from "fastify";
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import scalarAPIReference from '@scalar/fastify-api-reference'

import { createCourseRoute } from "./routes/create-course.ts";
import { getCoursesRoute } from "./routes/get-courses.ts";
import { getCourseById } from "./routes/get-course-by-id.ts";

const PORT = 3000;

/* SERVER CONFIG */

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
}).withTypeProvider<ZodTypeProvider>()

// Validação e Serialização
server.setValidatorCompiler(validatorCompiler) // Valida os dados de entrada
server.setSerializerCompiler(serializerCompiler) // Converte/serializa os dados de saída

// Documentação
if (process.env.NODE_ENV === 'development') {
  // Configuração da documentação no formato OpenAPI (JSON com um padrão de documentação)
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Courses Management API',
        description: 'API to manage courses',
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform
  })

  // UI Swagger da documentação
  // server.register(fastifySwaggerUi, {
  //   routePrefix: '/docs'
  // })

  // UI Scalar da documentação
  server.register(scalarAPIReference, {
    routePrefix: '/docs',
    // configuration: {
    //   theme: 'kepler'// tema da documentação
    // }
  })
}



/* ROUTES */

server.get("/api/health", async () => {
  return { status: "ok" };
});

server.register(createCourseRoute, { prefix: "/api" })
server.register(getCoursesRoute, { prefix: "/api" })
server.register(getCourseById, { prefix: "/api" })

server.listen({ port: PORT }).then(() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});