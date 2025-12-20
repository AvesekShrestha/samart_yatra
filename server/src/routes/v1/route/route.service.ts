import { InvalidPayloadError } from "../../../types/error.type"
import { routeZodSchema, ZodRoute, IRouteResponse } from "../../../types/route.type"
import RouteRepository from "./route.repository"


const RouteService = {
    async create(payload: ZodRoute): Promise<IRouteResponse> {

        const result = routeZodSchema.safeParse(payload)
        if (!result.success) throw result.error

        const route = await RouteRepository.create(payload)
        const response: IRouteResponse = {
            routeId: route._id.toString(),
            name: route.name,
            start: route.start,
            end: route.end,
            fair: route.fair
        }
        return response

    },
    async getAll(): Promise<IRouteResponse[]> {
        const routes = await RouteRepository.getAll();
        const response: IRouteResponse[] = routes.map(route => ({
            routeId: route._id.toString(),
            name: route.name,
            start: route.start,
            end: route.end,
            fair: route.fair,
            stops: route.stops || []
        }))

        return response
    },
    async getById(id: string): Promise<IRouteResponse> {

        if (!id) throw new InvalidPayloadError("Id is required");

        const route = await RouteRepository.getById(id)
        const response: IRouteResponse = {
            routeId: route._id.toString(),
            name: route.name,
            start: route.start,
            end: route.end,
            fair: route.fair,
            stops: route.stops || []
        }
        return response
    }

}

export default RouteService
