import type { ILocation } from "./location.type"

export interface IVehicleResponse {
    vehicleId: string
    vehicleNumber: string
}

export interface IVehicleRequest {
    vehicleNumber: string
    userId: ILocation
}
