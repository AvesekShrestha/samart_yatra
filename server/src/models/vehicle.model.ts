import mongoose from "mongoose"
import { IVehicle } from "../types/vehicle.type"

const vehicleSchema = new mongoose.Schema<IVehicle>({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "route"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

})

const Vehicle = mongoose.model<IVehicle>("vehicle", vehicleSchema)

export default Vehicle
