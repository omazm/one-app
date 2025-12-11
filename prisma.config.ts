// import 'dotenv/config'
// import { PrismaMariaDb } from '@prisma/adapter-mariadb'


// const adapter = new PrismaMariaDb({
//   host: "localhost",
//   port: 3306,
//   connectionLimit: 5
// })



import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
