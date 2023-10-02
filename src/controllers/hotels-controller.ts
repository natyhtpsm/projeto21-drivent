import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import { hotelsService } from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotels = await hotelsService.getHotels(userId)
    return res.status(httpStatus.OK).json(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { id } = req.params;
    const hotel = await hotelsService.getHotelById(Number(id), userId);
    res.status(httpStatus.OK).json(hotel);
}