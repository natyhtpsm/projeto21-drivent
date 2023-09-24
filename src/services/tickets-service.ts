import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/tickets-repositorty";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { TicketStatus } from "@prisma/client";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();

  if (!ticketTypes) {
    throw notFoundError();
  }
  return ticketTypes;
}



const ticketService = {
  getTicketTypes,
//   getTicketByUserId,
//   createTicket
};

export default ticketService;