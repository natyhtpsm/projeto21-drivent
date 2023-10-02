import app, { init } from "@/app";
import supertest from "supertest";
import { createUser } from "../factories";
import { createHotel, createHotelWithRooms } from "../factories/hotels-factory";
import { cleanDb, generateValidToken } from "../helpers";



beforeAll(async () => {
  await init();
    const server = supertest(app);
});

beforeEach(async () => {
  await cleanDb();
});