import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from "express"
import { sendSuccess } from "../../../utils/responseHelper";
import UserService from "./user.service";

const UserController = {
    getUserVehicle: asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user?.userId as string
        const response = await UserService.getUserVehicle(userId)

        sendSuccess(res, response, "Fetched user vehicle successfully", 200)
    })
}

export default UserController
