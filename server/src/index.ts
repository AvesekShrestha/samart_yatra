import express from "express"
import { errorMiddleware } from "./middlewares/error.middleware"
import cors from "cors"
import { Request, Response } from "express"
import router from "./routes"
import { connectDb } from "./config/database"

connectDb()
const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/health", (_req: Request, res: Response) => {
    res.json({ message: "Server health is at top nutch" })
})

app.use("/api", router)


app.use(errorMiddleware)

app.listen(8000, () => {
    console.log("server listenting at port 8000")
})
