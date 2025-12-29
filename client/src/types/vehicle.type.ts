import type { ILocation } from "./location.type"

export interface IVehicleResponse {
    vehicleId: string
    vehicleNumber: string
}

export interface IVehicleRequest {
    name: string
    location: ILocation
}
