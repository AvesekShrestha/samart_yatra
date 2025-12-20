import express from "express"
import RouteController from "./route.controller"
import { protect } from "../../../middlewares/auth.middleware"
import BusstopController from "../busstop/busstop.controller"
import VehicleController from "../vehicle/vehicle.controller"

const router = express.Router()


router.get("/", RouteController.getAll)
router.get("/:id", RouteController.getById)
router.get("/:routeId/busstops", BusstopController.getByRoute)
router.get("/:routeId/vehicles", VehicleController.getByRoute)

router.post("/", protect("admin"), RouteController.create)
router.post("/:routeId/busstops", protect("admin"), BusstopController.create)
router.post("/:routeId/vehicles", protect("admin"), VehicleController.create)


export default router
