import { z } from "zod"

export interface ILocation {
    lat: number
    long: number
}

export const zodLocationSchema = z.object({
    lat: z.number(),
    long: z.number()
})

export type ZodLocation = z.infer<typeof zodLocationSchema>

