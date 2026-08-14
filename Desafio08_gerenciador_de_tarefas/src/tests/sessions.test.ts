import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcrypt";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  beforeEach(async () => {
    await prisma.tasksHistory.deleteMany();
    await prisma.tasks.deleteMany();
    await prisma.teamMembers.deleteMany();
    await prisma.teams.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should authenticate a user successfully", async () => {
    const password = "123456";

    const user = await prisma.user.create({
      data: {
        name: "User Test",
        email: "user@test.com",
        password: await hash(password, 8),
      },
    });

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");

    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should not authenticate with an invalid email", async () => {
    const response = await request(app).post("/sessions").send({
      email: "email-inexistente@test.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should not authenticate with an invalid password", async () => {
    const password = "123456";

    const user = await prisma.user.create({
      data: {
        name: "User Test 2",
        email: "user2@test.com",
        password: await hash(password, 8),
      },
    });

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: "senha-errada",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });
});
