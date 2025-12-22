import { ILocation } from "./location.type"

export interface ISocketLocationUpdate {
    routeId: string
    vehicleId: string
    location: ILocation
}

