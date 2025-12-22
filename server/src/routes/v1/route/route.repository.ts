import { IRoute } from "../../../types/route.type";
import Route from "../../../models/route.model"
import { NotfoundError } from "../../../types/error.type";
import { IBusstopResponse } from "../../../types/busstop.type";

const RouteRepository = {
    async create(payload: IRoute) {
        const route = new Route({
            name: payload.name,
            start: payload.start,
            end: payload.end,
            fair: payload.fair,
        })

        await route.save()
        return route
    },
    async getAll() {

        const routes = await Route.find().populate<{ stops: IBusstopResponse[] }>({
            path: "stops"
        })
        if (!routes) throw new NotfoundError("No route founds")

        return routes
    },
    async getById(id: string) {
        const route = await Route.findById(id).populate<{ stops: IBusstopResponse[] }>({
            path: "stops"
        })

        if (!route) throw new NotfoundError("No route found")

        return route
    },

}

export default RouteRepository

