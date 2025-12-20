import express from "express"
import authRouter from "./auth/"
import routeRouter from "./route/"
import busstopRouter from "./busstop/"
import vehicleRouter from "./vehicle/"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/route", routeRouter)
router.use("/busstops", busstopRouter)
router.use("/vehicles", vehicleRouter)

export default router

