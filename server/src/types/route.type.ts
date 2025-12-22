import { IBusstopResponse } from "./busstop.type"
import { ILocation } from "./location.type"
import { z } from "zod"
import { zodLocationSchema } from "./location.type"

export interface IRoute {
    name: string
    start: ILocation
    end: ILocation
    fair: number
}

export const routeZodSchema = z.object({
    name: z.string().trim(),
    start: zodLocationSchema,
    end: zodLocationSchema,
    fair: z.number(),
})

export type ZodRoute = z.infer<typeof routeZodSchema>

export interface IRouteResponse extends IRoute {
    routeId: string
    stops?: IBusstopResponse[]
}
