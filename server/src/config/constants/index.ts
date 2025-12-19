import dotenv from "dotenv"
dotenv.config()

const rawPort = process.env.PORT
export const port: number = Number(rawPort) || 8000
export const mongodb_uri: string = process.env.MONGODB_URI || ""
export const database: string = process.env.DATABASE || ""
export const jwt_secret: string = process.env.JWT_SECRET || ""
