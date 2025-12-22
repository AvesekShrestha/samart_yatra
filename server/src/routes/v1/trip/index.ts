import express from "express"
import TripController from "./trip.controller"
import { protect } from "../../../middlewares/auth.middleware"

const router = express.Router()

router.use("/", protect("passenger", "rider", "admin"), TripController.handleQrScan)

export default router
