import { IRoute } from "express"
import { ILocation } from "./location.type"
import { z } from "zod"
import { zodLocationSchema } from "./location.type"
import { Types } from "mongoose"

export interface IBusstop {
    name: string
    location: ILocation,
    route: Types.ObjectId
}

export interface IBusstopResponse {
    bustopId: string
    name: string
    location: ILocation
    route?: IRoute
}

export interface IBusstopRequest extends Omit<IBusstop, "route"> {
    route: string
}

export const zodBusstopSchema = z.object({
    name: z.string().trim(),
    location: zodLocationSchema
})

export type ZodBusStop = z.infer<typeof zodBusstopSchema>

