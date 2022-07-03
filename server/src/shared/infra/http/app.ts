import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import express from "express";

import "../../container";
import swaggerDocument from "../../../swagger.json";

import { router } from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

export { app };

