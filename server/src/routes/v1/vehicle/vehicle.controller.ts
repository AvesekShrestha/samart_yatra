import { asyncHandler } from "../../../utils/asyncHandler"
import { Request, Response } from "express"
import { sendSuccess } from "../../../utils/responseHelper"
import VehicleService from "./vehicle.service"
import { InvalidPayloadError } from "../../../types/error.type"

const VehicleController = {

    create: asyncHandler(async (req: Request, res: Response) => {

        const payload = req.body
        const { routeId } = req.params

        if (!req.user) throw new InvalidPayloadError("request user is not set")
        const userId = req.user.userId

        const vehicle = await VehicleService.create(payload, routeId, userId)
        sendSuccess(res, vehicle, "Vehicle created successfully", 201)
    }),
    getByRoute: asyncHandler(async (req: Request, res: Response) => {

        const { routeId } = req.params

        const vehicles = await VehicleService.getByRoute(routeId)
        sendSuccess(res, vehicles, "Vechiles data fetched successfully", 200)
    }),
    delete: asyncHandler(async (req: Request, res: Response) => {
        const { vehicleId } = req.params

        await VehicleService.delete(vehicleId)
        sendSuccess(res, null, "Vechile deleted successfully", 200)
    })

}

export default VehicleController
