import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcrypt";

import { app } from "@/app";
import { prisma } from "@/database/prisma";
import { randomUUID } from "node:crypto";

describe("Tasks endpoints", () => {
  beforeEach(async () => {
    await prisma.tasksHistory.deleteMany();
    await prisma.tasks.deleteMany();
    await prisma.teamMembers.deleteMany();
    await prisma.teams.deleteMany();
    await prisma.user.deleteMany();
  });

  async function createUser(role: "admin" | "member") {
    const password = "123456";
    const id = randomUUID();

    const user = await prisma.user.create({
      data: {
        name: `${role} Test ${id}`,
        email: `${role}-${id}@test.com`,
        password: await hash(password, 8),
        role,
      },
    });

    return { user, password };
  }

  async function authenticateUser(email: string, password: string) {
    const response = await request(app).post("/sessions").send({
      email,
      password,
    });

    return response.body.token;
  }

  async function createTeam() {
    return prisma.teams.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Team para teste",
      },
    });
  }

  async function addUserToTeam(userId: string, teamId: string) {
    return prisma.teamMembers.create({
      data: {
        userId,
        teamId,
      },
    });
  }

  it("should allow an admin to create a task", async () => {
    const { user, password } = await createUser("admin");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Criar testes",
        description: "Criar testes para Tasks",
        priority: "high",
        status: "pending",
        teamId: team.id,
      });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Criar testes");
    expect(response.body.teamId).toBe(team.id);
    expect(response.body.assignedToId).toBe(user.id);
  });

  it("should not allow a member to create a task", async () => {
    const { user, password } = await createUser("member");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task proibida",
        teamId: team.id,
      });

    expect(response.status).toBe(401);
  });

  it("should allow a team member to list team tasks", async () => {
    const { user, password } = await createUser("member");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    await prisma.tasks.create({
      data: {
        title: "Primeira Task",
        description: "Descrição",
        status: "pending",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .get(`/tasks/${team.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Primeira Task");
  });

  it("should not allow a member from another team to list tasks", async () => {
    const { user, password } = await createUser("member");

    const team = await createTeam();

    // O usuário NÃO será adicionado ao Team.

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .get(`/tasks/${team.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should allow an admin to update a task", async () => {
    const { user, password } = await createUser("admin");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const task = await prisma.tasks.create({
      data: {
        title: "Task Original",
        description: "Descrição",
        status: "pending",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
        priority: "high",
      });

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("completed");
    expect(response.body.priority).toBe("high");
  });

  it("should not allow a member to update a task", async () => {
    const { user, password } = await createUser("member");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const task = await prisma.tasks.create({
      data: {
        title: "Task Original",
        description: "Descrição",
        status: "pending",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(response.status).toBe(401);
  });

  it("should create a history when task status changes", async () => {
    const { user, password } = await createUser("admin");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const task = await prisma.tasks.create({
      data: {
        title: "Task com histórico",
        description: "Descrição",
        status: "pending",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "in_progress",
      });

    expect(response.status).toBe(200);

    const history = await prisma.tasksHistory.findMany({
      where: {
        taskId: task.id,
      },
    });

    expect(history).toHaveLength(1);

    expect(history[0].oldStatus).toBe("pending");
    expect(history[0].newStatus).toBe("in_progress");
    expect(history[0].changedById).toBe(user.id);
  });

  it("should allow an admin to delete a task", async () => {
    const { user, password } = await createUser("admin");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const task = await prisma.tasks.create({
      data: {
        title: "Task para deletar",
        description: "Descrição",
        status: "pending",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    // Criamos um histórico para verificar
    // se ele também será removido.
    await prisma.tasksHistory.create({
      data: {
        taskId: task.id,
        changedById: user.id,
        oldStatus: "pending",
        newStatus: "in_progress",
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const deletedTask = await prisma.tasks.findUnique({
      where: {
        id: task.id,
      },
    });

    const history = await prisma.tasksHistory.findMany({
      where: {
        taskId: task.id,
      },
    });

    expect(deletedTask).toBeNull();
    expect(history).toHaveLength(0);
  });

  it("should allow a team member to see task history", async () => {
    const { user, password } = await createUser("member");

    const team = await createTeam();

    await addUserToTeam(user.id, team.id);

    const task = await prisma.tasks.create({
      data: {
        title: "Task com histórico",
        description: "Descrição",
        status: "in_progress",
        priority: "low",
        assignedToId: user.id,
        teamId: team.id,
      },
    });

    await prisma.tasksHistory.create({
      data: {
        taskId: task.id,
        changedById: user.id,
        oldStatus: "pending",
        newStatus: "in_progress",
      },
    });

    const token = await authenticateUser(user.email, password);

    const response = await request(app)
      .get(`/tasks/${task.id}/history`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].oldStatus).toBe("pending");
    expect(response.body[0].newStatus).toBe("in_progress");
  });
});
