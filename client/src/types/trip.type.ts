import type { IKhaltiPaymentResponse } from "./khalti.type";
import type { ILocation } from "./location.type";

export interface ITripRequest {
    location: ILocation
    vehicle: string
}

export interface ITripResponse {
    tripId: string
    boardingStop: ILocation
}

export interface IScanResponse {
    type: "newRide" | "payment"
    trip?: ITripResponse
    payment?: IKhaltiPaymentResponse
}
