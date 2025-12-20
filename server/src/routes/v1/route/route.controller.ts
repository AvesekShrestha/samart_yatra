import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import { sendSuccess } from "../../../utils/responseHelper";
import { ZodRoute } from "../../../types/route.type";
import RouteService from "./route.service";

const RouteController = {
    create: (asyncHandler(async (req: Request, res: Response) => {
        const payload: ZodRoute = req.body

        const data = await RouteService.create(payload)
        sendSuccess(res, data, "Route created successfully", 201)
    })),
    getAll: (asyncHandler(async (_req: Request, res: Response) => {
        const data = await RouteService.getAll()
        sendSuccess(res, data, "Route fetched successfully", 200)
    })),
    getById: (asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const data = await RouteService.getById(id)
        sendSuccess(res, data, "Route fetched successfully", 200)
    })),

}

export default RouteController
