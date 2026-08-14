import { Router } from "express";
import { MembersController } from "@/constrollers/members-controller";

const membersRoutes = Router();
const membersController = new MembersController();

membersRoutes.post("/teams/:teamId/members", membersController.create);
membersRoutes.delete("/teams/:teamId/members", membersController.delete);
membersRoutes.get("/team-members", membersController.index);

export { membersRoutes };
