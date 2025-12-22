import { Request, Response } from "express"
import { asyncHandler } from "../../../utils/asyncHandler"
import TripService from "./trip.service"
import { sendSuccess } from "../../../utils/responseHelper"

const TripController = {

    handleQrScan: asyncHandler(async (req: Request, res: Response) => {

        const payload = req.body
        const userId = req.user?.userId as string

        const data = await TripService.handleQrScan(payload, userId)
        sendSuccess(res, data, "Qr scan handled successfully", 200)
    })

}

export default TripController
