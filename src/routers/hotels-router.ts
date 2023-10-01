import { Router } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { authenticateToken } from "@/middlewares";

const hotelRouters = Router();

hotelRouters
    .all("/*", authenticateToken);


export { hotelRouters }

