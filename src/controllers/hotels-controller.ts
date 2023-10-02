import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import { hotelsService } from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try{
        const hotels = await hotelsService.getHotels(userId);
        if(!hotels){
            return res.status(httpStatus.NOT_FOUND).json(hotels);
        }
        return res.status(httpStatus.OK).json(hotels);
    } catch(error){
        if(error.name === "notFoundError"){
            return res.status(httpStatus.NOT_FOUND).json(error);
        }
        if(error.name === "paymentRequiredError"){
            return res.status(httpStatus.PAYMENT_REQUIRED).json(error);
        }
        return res.status(httpStatus.NOT_FOUND).json(error);
    }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { id } = req.params;
    try{
        const hotel = await hotelsService.getHotelById(Number(id), userId);
        res.status(httpStatus.OK).json(hotel);
    } catch(error){
        if(error.name === "notFoundError"){
            return res.status(httpStatus.NOT_FOUND).json(error);
        }
        if(error.name === "paymentRequiredError"){
            return res.status(httpStatus.PAYMENT_REQUIRED).json(error);
        }
        return res.status(httpStatus.NOT_FOUND).json(error);
    }
}