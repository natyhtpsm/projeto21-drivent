import { Prisma } from "@prisma/client";
import { prisma } from "@/config";

export async function createBooking(userId: number, roomId: number){
    const booking = await prisma.booking.create({
        data: {
        userId,
        roomId,
        }
    });
    return booking;
}

export async function createRoom(){
    const hotel = await prisma.hotel.create({
        data: {
        name: "Hotel Test",
        image: "https://www.hoteltest.com",
        },
    });
    const room = await prisma.room.create({
        data: {
        name: "Room Test",
        capacity: 1,
        hotelId: hotel.id,
        },
    });
    return room;
}