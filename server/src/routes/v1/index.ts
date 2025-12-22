import express from "express"
import authRouter from "./auth/"
import routeRouter from "./route/"
import busstopRouter from "./busstop/"
import vehicleRouter from "./vehicle/"
import tripRouter from "./trip/"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/route", routeRouter)
router.use("/busstops", busstopRouter)
router.use("/vehicles", vehicleRouter)
router.use("/trip", tripRouter)


export default router

