import { Router } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { authenticateToken } from "@/middlewares";
import { getHotelById, getHotels } from "@/controllers/hotels-controller";

const hotelRouters = Router();

hotelRouters

    .all("/*", authenticateToken)
    .get("/", getHotels)
    .get("/:id", getHotelById);

export { hotelRouters }

