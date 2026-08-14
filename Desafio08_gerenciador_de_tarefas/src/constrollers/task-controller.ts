import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TaskController {
  async create(request: Request, response: Response) {
    const user = request.user;

    if (user?.role === "member") {
      throw new AppError("Unauthorized", 401);
    }

    const bodySchema = z.object({
      title: z.string().trim().min(3).max(200),
      description: z.string().trim().optional(),
      status: z
        .enum(["pending", "in_progress", "completed"])
        .default("pending"),
      priority: z.enum(["high", "medium", "low"]).default("low"),
      teamId: z.string(),
    });

    const { title, description, status, priority, teamId } = bodySchema.parse(
      request.body,
    );

    const team = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const register = await prisma.user.findFirst({
      where: {
        id: user?.id,
      },
    });

    if (!register) {
      throw new AppError("User not found", 404);
    }

    const teamMember = await prisma.teamMembers.findUnique({
      where: {
        userId_teamId: {
          userId: register.id,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new AppError("User is not a member of this team", 400);
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedToId: register.id,
        teamId,
      },
    });

    return response.status(201).json(task);
  }

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string(),
    });

    const tokenSchema = z.object({
      id: z.string(),
    });

    const { id } = tokenSchema.parse(request.user);

    const { teamId } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const teamMember = await prisma.teamMembers.findUnique({
      where: {
        userId_teamId: {
          userId: id,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new AppError("User is not a member of this team", 400);
    }

    const tasks = await prisma.tasks.findMany({
      where: {
        teamId,
      },
    });

    return response.json(tasks);
  }

  async update(request: Request, response: Response) {
    const tokenSchema = z.object({
      id: z.string(),
      role: z.string(),
    });

    const paramsSchema = z.object({
      taskId: z.string(),
    });

    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]).optional(),

      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { id: userId, role } = tokenSchema.parse(request.user);

    const { taskId } = paramsSchema.parse(request.params);

    const { status, priority } = bodySchema.parse(request.body);

    if (role === "member") {
      throw new AppError("Unauthorized", 401);
    }

    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      const taskUpdated = await tx.tasks.update({
        where: {
          id: taskId,
        },
        data: {
          status,
          priority,
        },
      });

      if (status && status !== task.status) {
        await tx.tasksHistory.create({
          data: {
            taskId,
            changedById: userId,
            oldStatus: task.status,
            newStatus: status,
          },
        });
      }

      return taskUpdated;
    });

    return response.json(updatedTask);
  }

  async delete(request: Request, response: Response) {
    const tokenSchema = z.object({
      id: z.string(),
      role: z.string(),
    });

    const paramsSchema = z.object({
      taskId: z.string(),
    });

    const { id: userId, role } = tokenSchema.parse(request.user);

    if (role === "member") {
      throw new AppError("Unauthorized", 401);
    }

    const { taskId } = paramsSchema.parse(request.params);

    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.tasksHistory.deleteMany({
        where: {
          taskId,
        },
      });

      await tx.tasks.delete({
        where: {
          id: taskId,
        },
      });
    });

    return response.status(204).json();
  }
}

export { TaskController };
