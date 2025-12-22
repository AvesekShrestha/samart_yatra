import { Server } from "socket.io"
import { BadRequestError } from "../../types/error.type";

let io: Server | null = null;

export const initateSocket = (httpServer: any): void => {
    if (io) return

    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173"
        }
    })
}

export const getSocket = (): Server => {
    if (!io)
        throw new BadRequestError("Socket is not initalized")
    return io
}

