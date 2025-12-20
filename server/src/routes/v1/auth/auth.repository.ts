import { IUser } from "../../../types/user.type"
import User from "../../../models/user.model"

const AuthRepository = {

    async register(payload: IUser) {
        const user = new User({
            ...payload,
        })

        await user.save()
        return user
    }
}


export default AuthRepository
