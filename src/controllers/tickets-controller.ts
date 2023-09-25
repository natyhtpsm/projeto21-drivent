import { AuthenticatedRequest } from "@/middlewares";
import ticketService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketsForUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await ticketService.getTicketForUser(userId);

    if (!ticket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const formattedTicket = {
      id: ticket.id,
      status: ticket.status,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,
      TicketType: {
        id: ticket.TicketType.id,
        name: ticket.TicketType.name,
        price: ticket.TicketType.price,
        isRemote: ticket.TicketType.isRemote,
        includesHotel: ticket.TicketType.includesHotel,
        createdAt: ticket.TicketType.createdAt,
        updatedAt: ticket.TicketType.updatedAt,
      },
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return res.status(httpStatus.OK).json(formattedTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketTypesList();
    if (ticketTypes.length === 0) {
      return res.status(httpStatus.OK).json([]);
    }
    const formattedTicketTypes = ticketTypes.map((ticketType) => ({
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    }));

    return res.status(httpStatus.OK).json(formattedTicketTypes);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao buscar os tipos de ingresso' });
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  if (!ticketTypeId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const ticket = await ticketService.createReservedTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
