import express from "express"
import BusstopController from "./busstop.controller"

const router = express.Router()

router.delete("/:busstopId", BusstopController.delete)


export default router
