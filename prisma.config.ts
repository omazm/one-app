// import 'dotenv/config'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb'
// import { PrismaClient } from './lib/generated/prisma'

// const adapter = new PrismaMariaDb({
//   host: "localhost",
//   port: 3306,
//   connectionLimit: 5
// })
// export const prisma = new PrismaClient({ adapter })
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
