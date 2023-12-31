import bookingRepository from "@/repositories/booking-repository";
import { notFoundError } from "@/errors";
import { unauthorizedError } from "@/errors/unauthorized-error";
import { enrollmentRepository } from "@/repositories/enrollments-repository";
import { ticketsRepository } from "@/repositories/tickets-repository";
import { forbiddenError } from "@/errors/forbidden-error";

async function getBooking(userId: number) {
  await checkEnrollment(userId);
	
  const booking = await bookingRepository.findBookingByUserId(userId);

  if(!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: {
      ...booking.Room
    }
  };
}

async function checkEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
	
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
}

async function checkRoomInfo(roomId: number) {
  if(roomId < 1) {
    throw notFoundError();
  }

  const roomData = await bookingRepository.isRoomAvailable(roomId);

  if(!roomData) {
    throw notFoundError();
  } if(roomData.Booking.length >= roomData.capacity) {
    throw forbiddenError();
  }
}

async function postBooking(userId: number, roomId: number) {
  await checkEnrollment(userId);

  const isUserBooked = await bookingRepository.findBookingByUserId(userId);

  if(isUserBooked) {
    throw forbiddenError();
  }

  await checkRoomInfo(roomId);
	
  const bookingData = {
    userId,
    roomId
  };

  const booking = await bookingRepository.createBooking(bookingData);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await checkEnrollment(userId);
  await checkRoomInfo(roomId);

  const reservation = await bookingRepository.checkReservation(userId);
  if(!reservation) {
    throw forbiddenError();
  }
	
  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  if(booking.userId !== userId) {
    throw forbiddenError();
  }

  return booking;
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking
};

export default bookingService;