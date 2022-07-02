import { Router } from "express";

import { controllerAdapter } from "./controllerAdapter";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { CreateTaskController } from "../../../../modules/tasks/controllers/CreateTaskController";
import { ListTasksByUserController } from "../../../../modules/tasks/controllers/ListTasksByUserController";
import { UpdateTaskController } from "../../../../modules/tasks/controllers/UpdateTaskController";
import { DeleteTaskController } from "../../../../modules/tasks/controllers/DeleteTaskController";

const tasksRoutes = Router();

const createTaskController = new CreateTaskController();
const listTasksByUserController = new ListTasksByUserController();
const updateTaskController = new UpdateTaskController();
const deleteTaskController = new DeleteTaskController();

tasksRoutes.post("/", ensureAuthenticated, controllerAdapter(createTaskController));
tasksRoutes.get("/", ensureAuthenticated, controllerAdapter(listTasksByUserController));
tasksRoutes.put("/:taskId", ensureAuthenticated, controllerAdapter(updateTaskController));
tasksRoutes.delete("/:taskId", ensureAuthenticated, controllerAdapter(deleteTaskController))

export { tasksRoutes };