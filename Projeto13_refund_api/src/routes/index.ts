import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { uploadsRoutes } from "./uploads-routes";
import { refundsRoutes } from "./refund-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);
routes.use("/uploads", uploadsRoutes);

export { routes };
