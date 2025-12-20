import mongoose from "mongoose"
import { IRoute } from "../types/route.type"
import { locationSchema } from "./location.model"


const routeSchema = new mongoose.Schema<IRoute>({
    name: String,
    start: {
        type: locationSchema
    },
    end: {
        type: locationSchema
    },
    fair: Number,
    stops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "busstop"
    }]
})

const Route = mongoose.model<IRoute>("route", routeSchema)
export default Route
