import { Types } from "mongoose"
import { IUserResponse } from "./user.type"
import { IRouteResponse } from "./route.type"
import { z } from "zod"

export interface IVehicle {
    vehicleNumber: string
    route: Types.ObjectId
    user: Types.ObjectId
}

export interface IVehicleRequest {
    vehicleNumber: string
    route: string
    user: string
}

export interface IVehicleResponse {
    vehicleId: string
    vehicleNumber: string,
    route?: IRouteResponse,
    user?: IUserResponse
}

export const zodVehicleSchema = z.object({
    vehicleNumber: z.string().trim()
})


export type ZodVehicle = z.infer<typeof zodVehicleSchema>
