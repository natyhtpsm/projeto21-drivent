import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes} from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes);
export { ticketsRouter };