import mongoose from "mongoose"
import { IUser } from "../types/user.type"

const userSchema = new mongoose.Schema<IUser>({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        enum: ["rider", "user", "admin"],
        default: "user"
    }
})

const User = mongoose.model<IUser>("user", userSchema)

export default User

