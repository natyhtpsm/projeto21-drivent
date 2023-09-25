import { prisma } from "@/config";
import { Ticket, TicketType } from "@prisma/client";

interface TicketWithTicketType extends Ticket {
  TicketType: TicketType;
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<TicketWithTicketType | null> {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    }
  });
}

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function createTicket(ticketData: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      ...ticketData,
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const ticketRepository = {
  findTicketTypes,
  createTicket,
  findTicketByEnrollmentId
};

export { TicketWithTicketType };
export default ticketRepository;
