import express from "express"
import VehicleController from "./vehicle.controller"

const router = express.Router()

router.delete("/:vehicleId", VehicleController.delete)

export default router
