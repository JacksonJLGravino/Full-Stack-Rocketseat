import { Router } from "express";
import { SessionsController } from "@/constrollers/sessions-controller";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };
