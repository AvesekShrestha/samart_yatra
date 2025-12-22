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
})

routeSchema.virtual("stops", {
    ref: "busstop",
    localField: "_id",
    foreignField: "route"
})

routeSchema.set("toJSON", { virtuals: true })
routeSchema.set("toObject", { virtuals: true })

const Route = mongoose.model<IRoute>("route", routeSchema)
export default Route
