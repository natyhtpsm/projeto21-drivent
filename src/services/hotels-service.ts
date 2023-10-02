import { hotelsRepository } from "@/repositories/hotels-repository";
import { ticketsRepository } from "@/repositories";
import { enrollmentRepository } from "@/repositories";
import { notFoundError } from "@/errors";
import { paymentRequiredError } from "@/errors";

async function verifyEnrollmentTicket(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket){
        throw notFoundError();
    }
    if(ticket.status !== "PAID"){
        throw paymentRequiredError();
    }
    if(ticket.TicketType.isRemote === true){ 
        throw paymentRequiredError();
    }
    if(ticket.TicketType.includesHotel === false){
        throw paymentRequiredError();
    }

}

async function getHotels(userId: number){
    await verifyEnrollmentTicket(userId);
    const hotels =  await hotelsRepository.getHotels();
    if(!hotels){
        throw notFoundError();
    }
    return hotels;
}

async function getHotelById(id: number, userId: number) {
    await verifyEnrollmentTicket(userId);
    const hotels = await hotelsRepository.getHotelById(id);
    if(!hotels){
        throw notFoundError();
    }
    return hotels;
}

export const hotelsService = {
    getHotelById,
    getHotels,
};