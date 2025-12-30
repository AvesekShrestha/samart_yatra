import { Types } from "mongoose";
import { z } from "zod"
import { ILocation, zodLocationSchema } from "./location.type";
import { IVehicleResponse } from "./vehicle.type";
import { IUserResponse } from "./user.type";
import { IPaymentResponse } from "./payment.type";

export interface ITrip {
    boardingStop?: ILocation
    exitStop?: ILocation
    fare: number
    paymentStatus: "pending" | "completed" | "failed"
    pidx: string
    amount: number
    vehicle: Types.ObjectId
    user: Types.ObjectId
}

export interface ITripRequest {
    boardingStop?: ILocation
    exitStop?: ILocation
    vehicle: string
    user: string
}

export interface ITripResponse {
    tripId: string
    boardingStop?: ILocation
    exitStop?: ILocation
    fare?: number
    paymentStatus?: "pending" | "completed" | "failed" | "none"
    vehicle?: IVehicleResponse,
    user?: IUserResponse,
}

export interface IQrScanResponse {
    type: "newRide" | "payment"
    trip?: ITripResponse
    payment?: IPaymentResponse
}

export const zodTripSchema = z.object({
    vehicle: z.string().trim(),
    location: zodLocationSchema
})

export type ZodTrip = z.infer<typeof zodTripSchema>

