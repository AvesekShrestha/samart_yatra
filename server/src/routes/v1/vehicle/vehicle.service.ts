import { IVehicleResponse, ZodVehicle, zodVehicleSchema, IVehicleRequest } from "../../../types/vehicle.type";
import VehicleRepository from "./vehicle.repository";
import { AlreadyExistsError, InvalidPayloadError } from "../../../types/error.type";
import UserService from "../user/user.service";

const VehicleService = {
    async create(payload: ZodVehicle, route: string): Promise<IVehicleResponse> {

        const result = zodVehicleSchema.safeParse(payload)
        if (!result.success) throw result.error

        if (!route) throw new InvalidPayloadError("Both user and route is required");

        const user = await UserService.getById(payload.userId)
        const userVehicle: IVehicleResponse[] = user.vehicle

        if (userVehicle.length > 0) throw new AlreadyExistsError("you already have vehicle")

        const vehiclePayload: IVehicleRequest = {
            vehicleNumber: payload.vehicleNumber,
            route,
            user: user._id.toString()

        }

        const data = await VehicleRepository.create(vehiclePayload)

        const response: IVehicleResponse = {
            vehicleId: data._id.toString(),
            vehicleNumber: data.vehicleNumber,
        }

        return response
    },
    async getByRoute(routeId: string): Promise<IVehicleResponse[]> {
        if (!routeId) throw new InvalidPayloadError("Route id is required")

        const vehicles = await VehicleRepository.getByRoute(routeId)

        const response: IVehicleResponse[] = vehicles.map(vehicle => ({
            vehicleId: vehicle._id.toString(),
            vehicleNumber: vehicle.vehicleNumber,
            user: vehicle.user
        }))

        return response
    },
    async delete(vechicleId: string): Promise<boolean> {
        if (!vechicleId) throw new InvalidPayloadError("Vehicle id is required")
        return await VehicleRepository.delete(vechicleId)
    }
}

export default VehicleService
