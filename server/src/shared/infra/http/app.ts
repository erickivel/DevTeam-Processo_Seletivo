import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import express from "express";
import winston from "winston";
import expressWinston from "express-winston";

import "../../container";
import swaggerDocument from "../../../swagger.json";

import { router } from './routes';
import { labels } from "./logger";

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
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((info) => `${info.level}: ${info.message}`),
  ),
}));

app.use(router);

export { app };

