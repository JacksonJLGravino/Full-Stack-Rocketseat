import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcrypt";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("Teams endpoints", () => {
  beforeEach(async () => {
    await prisma.tasksHistory.deleteMany();
    await prisma.tasks.deleteMany();
    await prisma.teamMembers.deleteMany();
    await prisma.teams.deleteMany();
    await prisma.user.deleteMany();
  });

  async function createUser(role: "admin" | "member") {
    const password = "123456";

    const user = await prisma.user.create({
      data: {
        name: `${role} Test`,
        email: `${role}@test.com`,
        password: await hash(password, 8),
        role,
      },
    });

    return {
      user,
      password,
    };
  }

  async function authenticateUser(email: string, password: string) {
    const response = await request(app).post("/sessions").send({
      email,
      password,
    });

    return response.body.token;
  }

  it("should allow an admin to create a team", async () => {
    const { user, password } = await createUser("admin");

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Team Test",
        description: "Team criado pelo teste",
      });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Team Test");
    expect(response.body.description).toBe("Team criado pelo teste");
  });

  it("should not allow a member to create a team", async () => {
    const { user, password } = await createUser("member");

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Team Test",
        description: "Tentativa de criação",
      });

    expect(response.status).toBe(401);
  });

  it("should allow an admin to list teams", async () => {
    const { user, password } = await createUser("admin");

    await prisma.teams.createMany({
      data: [
        {
          name: "Team 1",
          description: "Primeiro team",
        },
        {
          name: "Team 2",
          description: "Segundo team",
        },
      ],
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .get("/teams")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("should allow an admin to update a team", async () => {
    const { user, password } = await createUser("admin");

    const team = await prisma.teams.create({
      data: {
        name: "Team Original",
        description: "Descrição original",
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .patch(`/teams/${team.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Team Atualizado",
        description: "Descrição atualizada",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Team Atualizado");
    expect(response.body.description).toBe("Descrição atualizada");
  });

  it("should allow an admin to delete a team", async () => {
    const { user, password } = await createUser("admin");

    const team = await prisma.teams.create({
      data: {
        name: "Team Para Deletar",
        description: "Team temporário",
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .delete(`/teams/${team.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const deletedTeam = await prisma.teams.findUnique({
      where: {
        id: team.id,
      },
    });

    expect(deletedTeam).toBeNull();
  });
});
