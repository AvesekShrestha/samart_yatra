import express from "express"
import { protect } from "../../../middlewares/auth.middleware"
import UserController from "./user.controller"

const router = express.Router()

router.get("/", UserController.getAll)
router.get("/vehicle", protect("rider"), UserController.getUserVehicle)

export default router
