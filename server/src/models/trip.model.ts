import mongoose from "mongoose"
import { ITrip } from "../types/trip.type"
import { locationSchema } from "./location.model"

const tripSchema = new mongoose.Schema<ITrip>({
    boardingStop: locationSchema,
    exitStop: locationSchema,
    fare: {
        type: Number,
        default: 0,

    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const Trip = mongoose.model<ITrip>("trip", tripSchema)

export default Trip

