import mongoose from "mongoose"
import { mongodb_uri, database } from "../constants"


export const connectDb = async () => {

    const connection = mongoose.connection

    connection.on("connected", () => {
        console.log("Database connected successfully")
    })

    try {
        await mongoose.connect(`${mongodb_uri}/${database}`)
    } catch (error: any) {
        console.log(error.message)
    }
}


