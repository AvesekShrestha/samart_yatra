import { IBusstopRequest } from "../../../types/busstop.type";
import Busstop from "../../../models/busstop.model";
import { NotfoundError } from "../../../types/error.type";

const BusstopRepository = {
    async create(payload: IBusstopRequest) {

        const busstop = new Busstop({
            name: payload.name,
            location: payload.location,
            route: payload.route
        })

        await busstop.save()
        return busstop
    },
    async getByRoute(routeId: string) {
        const busstops = await Busstop.find({ route: routeId })
        if (!busstops || busstops.length == 0) throw new NotfoundError("No busstop data")

        return busstops
    },
    async delete(busstopId: string): Promise<boolean> {
        await Busstop.findByIdAndDelete(busstopId)
        return true
    }
}

export default BusstopRepository
