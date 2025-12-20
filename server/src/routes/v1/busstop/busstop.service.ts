import { IBusstopRequest, IBusstopResponse, ZodBusStop, zodBusstopSchema } from "../../../types/busstop.type";
import { InvalidPayloadError } from "../../../types/error.type";
import BusstopRepository from "./busstop.repository";

const BusstopService = {
    async create(payload: ZodBusStop, route: string): Promise<IBusstopResponse> {

        const result = zodBusstopSchema.safeParse(payload)
        if (!result.success) throw result.error

        const busstopPayload: IBusstopRequest = {
            ...payload,
            route: route
        }

        const data = await BusstopRepository.create(busstopPayload)

        const response: IBusstopResponse = {
            bustopId: data._id.toString(),
            name: data.name,
            location: data.location,
        }
        return response
    },
    async getByRoute(routeId: string): Promise<IBusstopResponse[]> {
        if (!routeId) throw new InvalidPayloadError("routeId required")

        const busstops = await BusstopRepository.getByRoute(routeId)

        const response: IBusstopResponse[] = busstops.map(busstop => ({
            bustopId: busstop._id.toString(),
            name: busstop.name,
            location: busstop.location,
        }))

        return response
    },
    async delete(busstopId: string): Promise<boolean> {

        if (!busstopId) throw new InvalidPayloadError("Busstop id is required")
        await BusstopRepository.delete(busstopId)

        return true
    }
}

export default BusstopService


