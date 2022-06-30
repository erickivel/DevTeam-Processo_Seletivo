import { Router } from "express";

import { controllerAdapter } from "./controllerAdapter";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { CreateTaskController } from "../../../../modules/tasks/controllers/CreateTaskController";

const tasksRoutes = Router();

const createTaskController = new CreateTaskController()

tasksRoutes.post("/", ensureAuthenticated, controllerAdapter(createTaskController));

export { tasksRoutes };