import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel(params: any = {}) {
    return prisma.hotel.create({
        data: {
            name: faker.lorem.words(2),
            image: faker.image.imageUrl(),

        },
    });
}

export async function createHotelWithRooms(id: number) {
    return prisma.room.create({
        data: {
            name: faker.lorem.words(2),
            capacity: faker.datatype.number(10),
            hotelId: id,
        },
    });
}