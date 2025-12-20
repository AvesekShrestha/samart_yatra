import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express";
import BusstopService from "./busstop.service";
import { sendSuccess } from "../../../utils/responseHelper";

const BusstopController = {
    create: asyncHandler(async (req: Request, res: Response) => {

        const { routeId } = req.params
        const payload = req.body

        const busstop = await BusstopService.create(payload, routeId)
        sendSuccess(res, busstop, "Busstop created successfully", 201)
    }),
    getByRoute: asyncHandler(async (req: Request, res: Response) => {

        const { routeId } = req.params

        const busstops = await BusstopService.getByRoute(routeId)
        sendSuccess(res, busstops, "Busstop data fetched successfully", 200)
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {

        const { busstopId } = req.params

        await BusstopService.delete(busstopId)
        sendSuccess(res, null, "Busstop deleted successfully", 200)
    }),
}

export default BusstopController
