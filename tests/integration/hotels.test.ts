/* import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser, createHotel, createHotelWithRooms } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as hotelsService from "@/services/hotels-service";
import { paymentRequiredError, notFoundError } from "@/errors";
import { verifyEnrollmentTicket } from "@/services/hotels-service";

beforeAll(async () => {
  await init();
});

 beforeEach(async () => {
  await cleanDb();
}); 
const server = supertest(app);

jest.mock("@/services/hotels-service", () => {
  return {
    getHotels: jest.fn(),
    getHotelById: jest.fn(),
    verifyEnrollmentTicket: jest.fn(),
  };
});


describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    // Substitua a função mock para `verifyEnrollmentTicket`
    const verifyEnrollmentTicketMock = jest.spyOn(hotelsService, "verifyEnrollmentTicket");

    it("should respond with status 402 when user ticket is remote ", async () => {
      verifyEnrollmentTicketMock.mockImplementation(() => {
        // Simule o comportamento de um ticket não pago ou remoto
        throw new Error("Payment Required");
      });

      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 404 when user has no enrollment ", async () => {
      verifyEnrollmentTicketMock.mockImplementation(() => {
        // Simule o comportamento de não encontrar a inscrição
        throw new Error("Not Found");
      });

      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and a list of hotels", async () => {
      verifyEnrollmentTicketMock.mockImplementation(() => {
        // Simule o comportamento de sucesso na verificação
        return;
      });

      const user = await createUser();
      const token = await generateValidToken(user);
      const createdHotel = await createHotel();
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: createdHotel.id,
          name: createdHotel.name,
          image: createdHotel.image,
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
        },
      ]);
    });

    it("should respond with status 200 and an empty array", async () => {
      verifyEnrollmentTicketMock.mockImplementation(() => {
        // Simule o comportamento de sucesso na verificação
        return;
      });

      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 402 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      // Simule a função verifyEnrollmentTicket retornando uma exceção de pagamento
      jest.spyOn(hotelsService, 'verifyEnrollmentTicket').mockImplementation(() => {
        throw paymentRequiredError();
      });

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      // Simule a função verifyEnrollmentTicket retornando uma exceção de não encontrado
      jest.spyOn(hotelsService, 'verifyEnrollmentTicket').mockImplementation(() => {
        throw notFoundError();
      });

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 for invalid hotel id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      // Simule a função getHotelById retornando um hotel inexistente
      jest.spyOn(hotelsService, 'getHotelById').mockImplementation(() => {
        return null;
      });

      const response = await server.get("/hotels/100").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and hotel with rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdHotel = await createHotel();
      const createdRoom = await createHotelWithRooms(createdHotel.id);

      // Simule a função getHotelById retornando o hotel e os quartos
      jest.spyOn(hotelsService, 'getHotelById').mockImplementation(() => {
        return {
          id: createdHotel.id,
          name: createdHotel.name,
          image: createdHotel.image,
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
          Rooms: [{
            id: createdRoom.id,
            name: createdRoom.name,
            capacity: createdRoom.capacity,
            hotelId: createdHotel.id,
            createdAt: createdRoom.createdAt.toISOString(),
            updatedAt: createdRoom.updatedAt.toISOString(),
          }]
        };
      });

      const response = await server.get(`/hotels/${createdHotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        id: createdHotel.id,
        name: createdHotel.name,
        image: createdHotel.image,
        createdAt: createdHotel.createdAt.toISOString(),
        updatedAt: createdHotel.updatedAt.toISOString(),
        Rooms: [{
          id: createdRoom.id,
          name: createdRoom.name,
          capacity: createdRoom.capacity,
          hotelId: createdHotel.id,
          createdAt: createdRoom.createdAt.toISOString(),
          updatedAt: createdRoom.updatedAt.toISOString(),
        }]
      });
    });

    it("should respond with status 200 and hotel with no rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const createdHotel = await createHotel();

      // Simule a função getHotelById retornando o hotel sem quartos
      jest.spyOn(hotelsService, 'getHotelById').mockImplementation(() => {
        return {
          id: createdHotel.id,
          name: createdHotel.name,
          image: createdHotel.image,
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
          Rooms: [],
        };
      });

      const response = await server.get(`/hotels/${createdHotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual(
        {
          id: createdHotel.id,
          name: createdHotel.name,
          image: expect.any(String),
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
          Rooms: [],
        }
      );
    });
  });
});
 */