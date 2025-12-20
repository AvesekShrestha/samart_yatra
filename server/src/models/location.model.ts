import { ILocation } from "../types/location.type";
import mongoose from "mongoose"

export const locationSchema = new mongoose.Schema<ILocation>({
    lat: Number,
    long: Number
},
    { _id: false }
)
