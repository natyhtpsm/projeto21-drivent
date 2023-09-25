import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketsForUser, createTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .get("/types",authenticateToken, getTicketTypes)
  .get("", authenticateToken, getTicketsForUser)
  .post("", authenticateToken, createTicket);
export { ticketsRouter };