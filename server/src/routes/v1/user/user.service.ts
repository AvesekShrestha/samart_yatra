import { InvalidPayloadError } from "../../../types/error.type";
import UserRepository from "./user.repository";
import { IVehicleResponse } from "../../../types/vehicle.type";
import VehicleRepository from "../vehicle/vehicle.repository";



const UserService = {

    async getById(id: string) {

        if (!id) throw new InvalidPayloadError("Id required")

        return await UserRepository.getById(id);
    },
    async getByEmail(email: string) {

        if (!email) throw new InvalidPayloadError("Email is required")
        return await UserRepository.getByEmail(email);

    },
    async userExists(email: string): Promise<boolean> {

        if (!email) throw new InvalidPayloadError("Email is required")
        return await UserRepository.userExists(email);
    },
    async getUserVehicle(userId: string): Promise<IVehicleResponse> {
        if (!userId) throw new InvalidPayloadError("Userid is required")
        const vehicle = await VehicleRepository.getByUser(userId)

        const response: IVehicleResponse = {
            vehicleId: vehicle._id.toString(),
            vehicleNumber: vehicle.vehicleNumber,
        }
        return response
    }
}

export default UserService

