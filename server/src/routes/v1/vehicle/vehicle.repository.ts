import { NotfoundError } from "../../../types/error.type";
import { IVehicleRequest } from "../../../types/vehicle.type";
import Vehicle from "../../../models/vehicle.model";
import { IUserResponse } from "../../../types/user.type";

const VehicleRepository = {
    async create(payload: IVehicleRequest) {

        const vehicle = new Vehicle({
            vehicleNumber: payload.vehicleNumber,
            route: payload.route,
            user: payload.user
        })

        await vehicle.save()
        return vehicle
    },
    async getByRoute(routeId: string) {
        const vehicles = await Vehicle.find({ route: routeId }).populate<{ user: IUserResponse }>({
            path: "user",
            select: "-password"
        })
        if (!vehicles) throw new NotfoundError("No vehicle data")

        return vehicles
    },
    async getByUser(userId: string) {
        const vehicle = await Vehicle.findOne({ user: userId })

        if (!vehicle) throw new NotfoundError("No vehicles")
        return vehicle
    },
    async delete(vehicleId: string): Promise<boolean> {
        await Vehicle.findByIdAndDelete(vehicleId)
        return true
    }
}

export default VehicleRepository 
