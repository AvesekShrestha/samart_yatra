import express from "express"
import { createServer } from "http"
import { errorMiddleware } from "./middlewares/error.middleware"
import cors from "cors"
import { Request, Response } from "express"
import router from "./routes"
import { connectDb } from "./config/database"
import { initateSocket } from "./config/socket"
import SocketService from "./services/socket.service"
import cookieParser from "cookie-parser"

connectDb()
const app = express()
const httpServer = createServer(app)
initateSocket(httpServer)
SocketService.liveLocationSharing()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())


app.get("/health", (_req: Request, res: Response) => {
    res.json({ message: "Server health is at top nutch" })
})

app.use("/api", router)

app.use(errorMiddleware)

httpServer.listen(8000, "0.0.0.0", () => {
    console.log("server listenting at port 8000")
})
