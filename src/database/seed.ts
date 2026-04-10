import { fakerPT_BR as faker } from '@faker-js/faker'

import { db } from "./client.ts"
import { courses, enrollments, users } from "./schema.ts"

async function seed() {
  const insertedUsers = await db.insert(users).values([
    { name: faker.person.firstName(), email: faker.internet.email() },
    { name: faker.person.firstName(), email: faker.internet.email() },
    { name: faker.person.firstName(), email: faker.internet.email() },

  ]).returning()

  const insertedCourses = await db.insert(courses).values([
    { title: faker.lorem.words(4), description: faker.lorem.sentence() },
    { title: faker.lorem.words(4), description: faker.lorem.sentence() },
  ]).returning()

  await db.insert(enrollments).values([
    { userId: insertedUsers[0].id, courseId: insertedCourses[0].id },
    { userId: insertedUsers[1].id, courseId: insertedCourses[0].id },
    { userId: insertedUsers[2].id, courseId: insertedCourses[1].id },
  ])
}

seed()