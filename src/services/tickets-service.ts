import { unauthorizedError } from "@/errors";
import ticketRepository, { TicketWithTicketType } from "@/repositories/tickets-repository";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { TicketStatus } from "@prisma/client";
import { TicketType } from '@prisma/client';

const ticketService = {
  async createReservedTicket(userId: number, ticketTypeId: number): Promise<TicketWithTicketType | null> {
    try {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getTicketForUser(userId: number): Promise<TicketWithTicketType | null> {
    try {
      const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
      if (!enrollment) {
        throw unauthorizedError();
      }
      const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
      return ticket || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getTicketTypesList() {
    try {
      const ticketTypes = await ticketRepository.findTicketTypes();
      return ticketTypes || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default ticketService;

