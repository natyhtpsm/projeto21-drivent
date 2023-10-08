import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    }
  });
}

async function createBooking(booking: BookingData) {
  return prisma.booking.create({
    data: {
      ...booking
    }
  });
}

type BookingData = Omit<Booking, "id" | "createdAt" | "updatedAt">

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  createBooking,
  updateBooking
};

export default bookingRepository;