import express from "express"
import authRouter from "./auth/"
import routeRouter from "./route/"
import busstopRouter from "./busstop/"
import vehicleRouter from "./vehicle/"
import tripRouter from "./trip/"
import userRouter from "./user"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/route", routeRouter)
router.use("/busstops", busstopRouter)
router.use("/vehicles", vehicleRouter)
router.use("/trip", tripRouter)
router.use("/user", userRouter)


export default router

