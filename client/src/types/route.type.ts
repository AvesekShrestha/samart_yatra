import type { IBusstopResponse } from "./busstop.type"
import type { ILocation } from "./location.type"


export interface IRouteResponse {
    routeId: string
    name: string
    start: ILocation
    end: ILocation
    fair: string
    stops?: IBusstopResponse[]
}
