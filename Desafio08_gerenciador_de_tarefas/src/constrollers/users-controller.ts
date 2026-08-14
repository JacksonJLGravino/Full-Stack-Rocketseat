import { Request, Response } from "express";
import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UsersControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });
    const userWithSameName = await prisma.user.findFirst({ where: { name } });

    if (userWithSameEmail || userWithSameName) {
      throw new AppError("User already exists");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userwithoutPassword } = user;

    return response.status(201).json(userwithoutPassword);
  }
}

export { UsersControllers };
