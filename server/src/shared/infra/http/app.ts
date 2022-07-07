import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import express from "express";
import winston from "winston";
import expressWinston from "express-winston";

import "../../container";
import swaggerDocument from "../../../swagger.json";

import { router } from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test" ? true : false
    }),
  ],
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}",
  expressFormat: true,
  colorize: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((info) => `${info.level}: ${info.message}`),
  ),
}));

app.use(router);

export { app };

