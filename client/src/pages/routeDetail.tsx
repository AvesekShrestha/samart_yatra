import { useEffect, useState } from "react";
import SocketSingleton from "@/utils/socket";
import { useAxios } from "@/utils/axios";
import { useAuth } from "@/context/authContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import RouteMap from "@/components/custom/map";

import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";

export interface IVehicleLocation {
    vehicleId: string;
    routeId: string;
    location: { lat: string; long: string };
}

interface IVehicleResponse {
    vehicleId: string;
    vehicleNumber: string;
}

const RouteDetail = () => {
    const { routeId } = useParams<{ routeId: string }>();
    const { user } = useAuth();
    const api = useAxios();
    const socket = SocketSingleton.getInstance();

    const [vehicleLocations, setVehicleLocations] = useState<Record<string, IVehicleLocation>>({});
    const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(true);

    const { data: route, isLoading: routeLoading } = useQuery({
        queryKey: ["route", routeId],
        queryFn: async () => {
            const response = await api.get<IResponse<IRouteResponse>>(`route/${routeId}`);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        },
        enabled: !!routeId
    });

    const { data: vehicleData } = useQuery({
        queryKey: ["vehicle"],
        queryFn: async () => {
            const response = await api.get<IResponse<IVehicleResponse>>("/user/vehicle");
            return response.data.data;
        },
        enabled: user?.role === "rider",
    });

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserPosition([lat, lng]);
                setIsLocating(false);

                if (user?.role === "rider" && vehicleData?.vehicleId && routeId) {
                    socket.emit("locationUpdate", {
                        vehicleId: vehicleData.vehicleId,
                        routeId,
                        location: { lat: lat.toString(), long: lng.toString() },
                    });
                }
            },
            (err) => {
                console.warn("GPS Signal Error:", err.message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user?.role, vehicleData?.vehicleId, routeId, socket]);

    useEffect(() => {
        if (!routeId) return;
        socket.emit("joinRoute", { routeId, user });

        const handleUpdate = (update: IVehicleLocation) => {
            setVehicleLocations(prev => ({ ...prev, [update.vehicleId]: update }));
        };

        socket.on("vehicleLocation", handleUpdate);
        return () => {
            socket.off("vehicleLocation", handleUpdate);
            socket.emit("leaveRoute", routeId);
        };
    }, [routeId, socket]);

    if (routeLoading) return <div className="h-screen flex items-center justify-center">Loading route...</div>;
    if (!route) return <div className="h-screen flex items-center justify-center">Route not found</div>;

    return (
        <div className="relative h-full w-full overflow-hidden">
            <RouteMap
                route={route}
                vehicleLocations={vehicleLocations}
                userPosition={userPosition}
                isLocating={isLocating}
                currentVehicleId={vehicleData?.vehicleId}
            />
        </div>
    );
};

export default RouteDetail;
