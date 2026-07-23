import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";

class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const table = await knex<TableRepository>("table")
        .select()
        .orderBy("table_number");

      return response.json(table);
    } catch (error) {
      next(error);
    }
  }
}

export { TablesController };
