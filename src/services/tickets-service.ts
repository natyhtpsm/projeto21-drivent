import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/tickets-repository";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { TicketStatus } from "@prisma/client";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();
  if (!ticketTypes || ticketTypes.length === 0) {
    return [];
  }
  return ticketTypes;
}


  async function getTicketByUserId(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
      throw notFoundError();
    }
  
    return ticket;
  }
  
  async function createTicket(userId: number, ticketTypeId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
  
    const ticketData = {
      ticketTypeId,
      enrollmentId: enrollment.id,
      status: TicketStatus.RESERVED
    };
  
    await ticketRepository.createTicket(ticketData);
  
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
    return ticket;
  }
  
  const ticketService = {
    getTicketTypes,
    getTicketByUserId,
    createTicket
  };
  
  export default ticketService;

