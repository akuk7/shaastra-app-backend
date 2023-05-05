import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { TaskResolver } from "./taskResolver";
import { GraphQLSchema } from "graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Task } from "./Task";

async function bootstrap() {
  const schema: GraphQLSchema = await buildSchema({
    resolvers: [TaskResolver],
    validate: { forbidUnknownValues: false },
  });
  const server = new ApolloServer({
    schema,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log("server is running", url);
}

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Amjad@2002",
  database: "taskdb",
  entities: [Task],
  synchronize: true,
});
dataSource.initialize().then(async () => {
  console.log("data source initialized");
  bootstrap();
});
