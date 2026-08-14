import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3).max(100),
      description: z.string().trim().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const teamWithSameName = await prisma.teams.findUnique({
      where: { name },
    });

    if (teamWithSameName) {
      throw new AppError("Team already exists");
    }

    const team = await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json(team);
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.teams.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(teams);
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().trim().min(3).max(100).optional(),
      description: z.string().trim().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    const team = await prisma.teams.findUnique({ where: { id } });

    if (!team) {
      throw new AppError("Team not found", 401);
    }

    const teamWithSameName = await prisma.teams.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    });

    if (teamWithSameName) {
      throw new AppError("Team already exists");
    }

    const updatedTeam = await prisma.teams.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return response.json(updatedTeam);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const team = await prisma.teams.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.teams.delete({
      where: {
        id,
      },
    });

    return response.status(204).send();
  }
}

export { TeamsController };
