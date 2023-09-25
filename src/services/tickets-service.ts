import { notFoundError } from "@/errors";
import ticketRepository, { TicketWithTicketType } from "@/repositories/tickets-repository";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { TicketStatus } from "@prisma/client";
import { BadRequestError } from "@/errors/bad-request"; 
import * as HttpStatus from 'http-status'; 

import { TicketType } from '@prisma/client';

async function createReservedTicket(userId: number, ticketTypeId: number): Promise<TicketWithTicketType> {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  if (!ticketTypeId) {
    throw new BadRequestError("ticketTypeId é obrigatório no corpo da requisição"); 
  }
  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  const newTicket = await ticketRepository.createTicket(ticketData);

  const ticketType = (await ticketRepository.findTicketTypes()).find(type => type.id === ticketTypeId);

  return {
    ...newTicket,
    TicketType: ticketType as TicketType,
  };
}

async function getTicketForUser(userId: number): Promise<TicketWithTicketType | null> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  return ticket;
}

async function getTicketTypesList() {
  const ticketTypes = await ticketRepository.findTicketTypes();
  if (!ticketTypes || ticketTypes.length === 0) {
    return [];
  }
  return ticketTypes;
}

const ticketService = {
  getTicketTypesList,
  getTicketForUser,
  createReservedTicket,
};

export default ticketService;
