import { unauthorizedError } from "@/errors";
import ticketRepository, { TicketWithTicketType } from "@/repositories/tickets-repository";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { TicketStatus } from "@prisma/client";
import { BadRequestError } from "@/errors/bad-request"; 
import { TicketType } from '@prisma/client';

async function createReservedTicket(userId: number, ticketTypeId: number): Promise<TicketWithTicketType | null> {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  if (!ticketTypeId) {
    throw unauthorizedError(); 
  }
  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  const newTicket = await ticketRepository.createTicket(ticketData);

  const ticketType = (await ticketRepository.findTicketTypes()).find(type => type.id === ticketTypeId);

  if (!ticketType) {
    return null;
  }

  return {
    ...newTicket,
    TicketType: ticketType as TicketType,
  };
}

async function getTicketForUser(userId: number): Promise<TicketWithTicketType | null> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  return ticket || null;
}

async function getTicketTypesList() {
  const ticketTypes = await ticketRepository.findTicketTypes();
  return ticketTypes || [];
}

const ticketService = {
  getTicketTypesList,
  getTicketForUser,
  createReservedTicket,
};

export default ticketService;
