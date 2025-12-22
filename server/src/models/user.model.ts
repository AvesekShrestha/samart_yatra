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
        enum: ["rider", "passenger", "admin"],
        default: "passenger"
    }
})

userSchema.virtual("vehicle", {
    ref: "vehicle",
    localField: "_id",
    foreignField: "user"
})

userSchema.set("toJSON", { virtuals: true })
userSchema.set("toObject", { virtuals: true })

const User = mongoose.model<IUser>("user", userSchema)

export default User

