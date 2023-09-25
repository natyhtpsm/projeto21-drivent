import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketsForUser, createTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTicketsForUser)
  .post('/',createTicket);

export { ticketsRouter };