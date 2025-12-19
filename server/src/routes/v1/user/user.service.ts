import { InvalidPayloadError } from "../../../types/error.type";
import UserRepository from "./user.repository";


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
    }
}

export default UserService

