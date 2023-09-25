import { prisma } from "@/config";
import { Ticket, TicketType } from "@prisma/client";

interface EnhancedTicket extends Ticket {
  TicketType: TicketType;
}

type CreateTicketData = Omit<Ticket, "id" | "createdAt" | "updatedAt">;

const ticketRepository = {
  async findTicketByEnrollmentId(enrollmentId: number): Promise<EnhancedTicket | null> {
    const ticket = await prisma.ticket.findFirst({
      where: {
        enrollmentId,
      },
      include: {
        TicketType: true,
      }
    });
    return ticket || null;
  },

  async findTicketTypes(): Promise<TicketType[]> {
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
  },

  async createTicket(ticketData: CreateTicketData): Promise<Ticket> {
    const newTicket = await prisma.ticket.create({
      data: {
        ...ticketData,
      }
    });
    return newTicket;
  }
};

export type { EnhancedTicket, CreateTicketData };
export default ticketRepository;
