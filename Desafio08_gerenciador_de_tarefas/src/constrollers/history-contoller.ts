import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class HistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      taskId: z.string(),
    });

    const tokenSchema = z.object({
      id: z.string(),
      role: z.string(),
    });

    const { taskId } = paramsSchema.parse(request.params);

    const { id: userId, role } = tokenSchema.parse(request.user);

    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (role !== "admin") {
      const teamMember = await prisma.teamMembers.findUnique({
        where: {
          userId_teamId: {
            userId,
            teamId: task.teamId,
          },
        },
      });

      if (!teamMember) {
        throw new AppError("User is not a member of this team", 403);
      }
    }

    const history = await prisma.tasksHistory.findMany({
      where: {
        taskId,
      },
      orderBy: {
        changedAt: "desc",
      },
    });

    return response.json(history);
  }
}

export { HistoryController };
