import { getSocket } from "../config/socket";
import { ISocketLocationUpdate } from "../types/socket.type";

const SocketService = {

    liveLocationSharing() {
        const io = getSocket()

        io.on("connection", (socket) => {
            console.log("New user connected")

            socket.on("joinRoute", (payload: { routeId: string }) => {
                socket.join(`route-${payload.routeId}`)
            })
            socket.on("locationUpdate", (payload: ISocketLocationUpdate) => {
                socket.to(`route-${payload.routeId}`).emit("vehicleLocation", payload)
            })
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`)
            })
        })
    }

}

export default SocketService
