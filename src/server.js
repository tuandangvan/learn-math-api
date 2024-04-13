/* eslint-disable no-console*/
import express from "express";
import { CONNECT_DATABASE, CLOSE_DATABASE } from "./config/mongodb.js";
import exitHook from "async-exit-hook";
import { env } from "./config/environment.js";
import { APIs_V1 } from "../src/routes/v1/index.js";
import cors from "cors";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";

const START_SERVER = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use("/api/v1", APIs_V1);
  app.use(errorHandlingMiddleware);

  const server = app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hello ${env.AUTHOR} Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });
  exitHook(() => {
    console.log("4. Server is shutting down");
    CLOSE_DATABASE();
    console.log("5. Disconnected from MongoDB Cloud Atlas");
  });

};

console.log("1. Connecting to MongoDB Cloud Atlas");
CONNECT_DATABASE()
  .then(() => {
    console.log("2. Connected to MongoDb Cloud Atlas !");
  })
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
