import { User } from "../../../models/user.model"
import { NotfoundError } from "../../../types/error.type";

const UserRepository = {

    async getById(id: string) {

        const user = await User.findById(id);

        if (!user) {
            throw new NotfoundError("user doesnot exists")
        }
        return user
    },
    async getByEmail(email: string) {

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotfoundError("user doesnot exists")
        }
        return user
    },
    async userExists(email: string): Promise<boolean> {
        const user = await User.findOne({ email });

        if (!user) return false
        return true
    }
}

export default UserRepository

