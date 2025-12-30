import express from "express"
import TripController from "./trip.controller"
import { protect } from "../../../middlewares/auth.middleware"

const router = express.Router()

router.post("/", protect("passenger", "rider", "admin"), TripController.handleQrScan)
router.post("/payment/verify", protect("passenger"), TripController.handlePaymentVerification)

export default router
