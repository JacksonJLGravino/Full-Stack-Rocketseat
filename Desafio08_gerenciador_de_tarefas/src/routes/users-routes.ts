import { Router } from "express";
import { UsersControllers } from "@/constrollers/users-controller";

const usersRoutes = Router();
const usersControllers = new UsersControllers();

usersRoutes.post("/", usersControllers.create);

export { usersRoutes };
