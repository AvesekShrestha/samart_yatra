import { getSocket } from "../config/socket";
import { ISocketLocationUpdate } from "../types/socket.type";
import { IUserResponse } from "../types/user.type";

interface JoinRoutePayload {
    routeId: string;
    user: IUserResponse
}

interface RouteStats {
    routeId: string;
    totalVehicles: number;
    totalPassengers: number;
}

const routes: Record<
    string,
    {
        vehicles: Set<string>;
        passengers: Set<string>;
    }
> = {};

const SocketService = {
    liveLocationSharing() {
        const io = getSocket();

        io.on("connection", (socket) => {
            console.log("New user connected:", socket.id);

            socket.on("joinRoute", (payload: JoinRoutePayload) => {
                console.log(payload)
                if (!routes[payload.routeId]) {
                    routes[payload.routeId] = {
                        vehicles: new Set(),
                        passengers: new Set(),
                    };
                }

                socket.join(`route-${payload.routeId}`);

                payload.user.role === "rider"
                    ? routes[payload.routeId].vehicles.add(socket.id)
                    : routes[payload.routeId].passengers.add(socket.id);
            });

            socket.on("locationUpdate", (payload: ISocketLocationUpdate) => {
                socket
                    .to(`route-${payload.routeId}`)
                    .emit("vehicleLocation", payload);
            });

            // 🔹 Send stats as ARRAY
            socket.on("fetchStats", () => {
                const statsArray: RouteStats[] = Object.entries(routes).map(
                    ([routeId, data]) => ({
                        routeId,
                        totalVehicles: data.vehicles.size,
                        totalPassengers: data.passengers.size,
                    })
                );

                socket.emit("allRouteStats", statsArray);
            });

            socket.on("disconnect", () => {
                for (const routeId in routes) {
                    routes[routeId].vehicles.delete(socket.id);
                    routes[routeId].passengers.delete(socket.id);
                }
            });
        });
    },
};

export default SocketService;
