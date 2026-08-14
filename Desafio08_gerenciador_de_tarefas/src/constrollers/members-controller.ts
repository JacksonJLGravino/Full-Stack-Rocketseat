import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class MembersController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string(),
    });

    const bodySchema = z.object({
      userIds: z.array(z.string()).min(1),
    });

    const { teamId } = paramsSchema.parse(request.params);
    const { userIds } = bodySchema.parse(request.body);

    const team = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    if (users.length !== userIds.length) {
      throw new AppError("One or more users not found", 404);
    }

    const teamMembers = await prisma.teamMembers.createMany({
      data: userIds.map((userId) => ({
        userId,
        teamId,
      })),
    });

    return response.json();
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamId: z.string(),
    });

    const bodySchema = z.object({
      userIds: z.array(z.string()).min(1),
    });

    const { teamId } = paramsSchema.parse(request.params);
    const { userIds } = bodySchema.parse(request.body);

    const team = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const teamMembers = await prisma.teamMembers.findMany({
      where: {
        teamId,
        userId: {
          in: userIds,
        },
      },
    });

    if (teamMembers.length !== userIds.length) {
      throw new AppError("One or more users are not members of this team");
    }

    await prisma.teamMembers.deleteMany({
      where: {
        teamId,
        userId: {
          in: userIds,
        },
      },
    });

    return response.status(204).json();
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.teams.findMany({
      select: {
        name: true,
        teamsMember: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return response.json(teams);
  }
}

export { MembersController };
