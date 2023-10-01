import { hotelsRepository } from "@/repositories/hotels-repository";
import { ticketsRepository } from "@/repositories";
import { enrollmentRepository } from "@/repositories";
import { notFoundError } from "@/errors";
import { paymentRequiredError } from "@/errors/payment-requred-error";

async function verifyEnrollmentTicket(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw notFoundError();
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
        throw paymentRequiredError();
    }
}

async function getHotels(userId: number) {
    return await hotelsRepository.getHotels();
}

async function getHotelById(id: number, userId: number) {
    await verifyEnrollmentTicket(userId);
    return await hotelsRepository.getHotelById(id);
}

export const hotelsService = {
    getHotelById,
    getHotels,
};