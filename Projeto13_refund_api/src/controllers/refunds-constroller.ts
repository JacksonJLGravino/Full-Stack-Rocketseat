import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { authConfig } from "@/configs/auth";
import { z } from "zod";
import { compare } from "bcrypt";
import { AppError } from "@/utils/AppError";
import jwt from "jsonwebtoken";

class RefundsController {
  async create(request: Request, response: Response) {
    response.json({ message: "ok" });
  }
}

export { RefundsController };
