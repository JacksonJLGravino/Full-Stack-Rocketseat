import { Router } from "express";
import { TaskController } from "@/constrollers/task-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { HistoryController } from "@/constrollers/history-contoller";

const taskRouter = Router();
const taskController = new TaskController();
const historyController = new HistoryController();

taskRouter.use(
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
);
taskRouter.post("/", taskController.create);
taskRouter.get("/:teamId", taskController.index);
taskRouter.patch("/:taskId", taskController.update);
taskRouter.delete("/:taskId", taskController.delete);
taskRouter.get("/:taskId/history", historyController.index);

export { taskRouter };
