import { Address, Booking, Enrollment, Hotel, Room, Ticket, TicketStatus, TicketType } from "@prisma/client"; 
import bookingRepository from "@/repositories/booking-repository";
import bookingService from "@/services/booking-service";
import { enrollmentRepository, ticketsRepository, } from "@/repositories";

beforeEach(() => {
    jest.clearAllMocks();
}
);

describe('GET /booking', () => {
    it('should return 404 when user does not have booking', async () => {
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(null);
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null);
    
        const promise = bookingService.getBooking(1);
        await expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it('should return booking data when user has booking', async () => {
        const booking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(booking);
        const result = await bookingService.getBooking(1);
        expect(result).toEqual(booking);
    });
});

describe('POST /booking', () => {
    it('should return 403 when ticket type is remote', async () => {
        const mockEnrollment: Enrollment & { Address: Address[] } = {
            id: 1,
            userId: 1,
            name: 'Nome do usuário',
            cpf: '12345678900',
            birthday: new Date('1990-01-01'),
            phone: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [ {
                id: 1,
                street: 'Street 1',
                city: 'City 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                cep: '12345678',
                state: 'State 1',
                number: "",
                neighborhood: "",
                addressDetail: "",
                enrollmentId: 0
            }]
        };
        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            enrollmentId: 1,
            ticketTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TicketStatus.RESERVED,
            TicketType: {
                id: 1,
                name: 'Remote',
                price: 1,
                isRemote: true,
                includesHotel: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(mockEnrollment);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(mockTicket);
        const promise = bookingService.postBooking(mockBooking.userId, mockBooking.roomId);
        await expect(promise).rejects.toEqual({
            name: 'Forbidden-Error',
            message: 'Error 403 - Forbidden',
        });
    });
    it('should return 403 when room is full', async () => {
        const mockEnrollment: Enrollment & { Address: Address[] } = {
            id: 1,
            userId: 1,
            name: 'Nome do usuário',
            cpf: '12345678900',
            birthday: new Date('1990-01-01'),
            phone: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [ {
                id: 1,
                street: 'Street 1',
                city: 'City 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                cep: '12345678',
                state: 'State 1',
                number: "",
                neighborhood: "",
                addressDetail: "",
                enrollmentId: 0
            }]
        };
        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            enrollmentId: 1,
            ticketTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TicketStatus.RESERVED,
            TicketType: {
                id: 1,
                name: 'Remote',
                price: 1,
                isRemote: false,
                includesHotel: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(mockEnrollment);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(mockTicket);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        const promise = bookingService.postBooking(mockBooking.userId, mockBooking.roomId);
        await expect(promise).rejects.toEqual({
            name: 'Forbidden-Error',
            message: 'Error 403 - Forbidden',
        });
    });
    it('should return 404 when booking doesn not exist', async () => {
        const mockEnrollment: Enrollment & { Address: Address[] } = {
            id: 1,
            userId: 1,
            name: 'Nome do usuário',
            cpf: '12345678900',
            birthday: new Date('1990-01-01'),
            phone: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [ {
                id: 1,
                street: 'Street 1',
                city: 'City 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                cep: '12345678',
                state: 'State 1',
                number: "",
                neighborhood: "",
                addressDetail: "",
                enrollmentId: 0
            }]
        };
        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            enrollmentId: 1,
            ticketTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TicketStatus.RESERVED,
            TicketType: {
                id: 1,
                name: 'Remote',
                price: 1,
                isRemote: false,
                includesHotel: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(mockEnrollment);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(mockTicket);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(null);
        const promise = bookingService.postBooking(mockBooking.userId, mockBooking.roomId);
        await expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it('should return booking id and room when booking is sucessfully created', async () => {
        const mockEnrollment: Enrollment & { Address: Address[] } = {
            id: 1,
            userId: 1,
            name: 'Nome do usuário',
            cpf: '12345678900',
            birthday: new Date('1990-01-01'),
            phone: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date(),
            Address: [ {
                id: 1,
                street: 'Street 1',
                city: 'City 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                cep: '12345678',
                state: 'State 1',
                number: "",
                neighborhood: "",
                addressDetail: "",
                enrollmentId: 0
            }]
        };
        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            enrollmentId: 1,
            ticketTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TicketStatus.RESERVED,
            TicketType: {
                id: 1,
                name: 'Remote',
                price: 1,
                isRemote: false,
                includesHotel: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(mockEnrollment);
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(mockTicket);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(mockBooking);
        jest.spyOn(bookingRepository, 'createBooking').mockResolvedValue(mockBooking);
        const result = await bookingService.postBooking(mockBooking.userId, mockBooking.roomId);
        expect(result).toEqual({
            id: mockBooking.id,
            Room: {
                ...mockBooking.Room
            }
        });
    });
});

describe ('PUT /booking/:id', () => {
    it('should return 404 when user has no booking', async () => {
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(null);
        const promise = bookingService.updateBooking(mockBooking.userId, 
            mockBooking.roomId, mockBooking.id);
        await expect(promise).rejects.toEqual({
            name: 'Forbidden-Error',
            message: 'Error 403 - Forbidden',
        });
    });
    it('should return 403 when room is full', async () => {
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(mockBooking);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        const promise = bookingService.updateBooking(mockBooking.userId, 
            mockBooking.roomId, mockBooking.id);
        await expect(promise).rejects.toEqual({
            name: 'Forbidden-Error',
            message: 'Error 403 - Forbidden',
        });
    });
    it('should return 403 when ticket type is remote', async () => {
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 1,
            }
        };
        const mockTicket: Ticket & { TicketType: TicketType } = {
            id: 1,
            enrollmentId: 1,
            ticketTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TicketStatus.RESERVED,
            TicketType: {
                id: 1,
                name: 'Remote',
                price: 1,
                isRemote: true,
                includesHotel: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(mockBooking);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(mockTicket);
        const promise = bookingService.updateBooking(mockBooking.userId, 
            mockBooking.roomId, mockBooking.id);
        await expect(promise).rejects.toEqual({
            name: 'Forbidden-Error',
            message: 'Error 403 - Forbidden',
        });
    });
    it('should return booking id and room when booking is sucessfully updated', async () => {
        const mockBooking: Booking & { Room: Room } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                hotelId: 1,
                name: 'Room 1',
                createdAt: new Date(),
                updatedAt: new Date(),
                capacity: 2,
            }
        };
        jest.spyOn(bookingRepository, 'findBookingByUserId').mockResolvedValue(mockBooking);
        jest.spyOn(bookingRepository, 'isRoomAvailable').mockResolvedValue({
            id: 1,
            hotelId: 1,
            name: 'Room 1',
            capacity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            Booking: [mockBooking]
        } as Room & { Booking: Booking[] });
        jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValue(mockBooking);
        const result = await bookingService.updateBooking(mockBooking.userId, 
            mockBooking.roomId, mockBooking.id);
        expect(result).toEqual({
            id: mockBooking.id,
            Room: {
                ...mockBooking.Room
            }
        });
    });
});    
