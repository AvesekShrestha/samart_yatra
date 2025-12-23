import type { ILocation } from "./location.type"

export interface IBusstopResponse {
    busstopId: string
    name: string
    location: ILocation
    route: string

}

