import mongoose from "mongoose"
import { IBusstop } from "../types/busstop.type"
import { locationSchema } from "./location.model"

export const bustopSchema = new mongoose.Schema<IBusstop>({
    name: String,
    location: locationSchema,
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "route"
    }
})

const Busstop = mongoose.model<IBusstop>("busstop", bustopSchema)

export default Busstop

