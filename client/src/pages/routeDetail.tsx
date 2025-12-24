import { useEffect, useState } from "react";
import SocketSingleton from "@/utils/socket";
import { useAxios } from "@/utils/axios";
import { useAuth } from "@/context/authContext";
import { useQuery } from "@tanstack/react-query";
import type { IResponse } from "@/types/response.type";
import type { ILocation } from "@/types/location.type";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import type { IRouteResponse } from "@/types/route.type";
import RouteMap from "@/components/custom/map";

export interface IVehicleLocation {
    vehicleId: string;
    routeId: string;
    location: ILocation;
}

interface IVehicleResponse {
    vehicleId: string;
    vehicleNumber: string;
}

const RouteDetail = () => {
    const [vehicleLocations, setVehicleLocations] = useState<Record<string, IVehicleLocation>>({});
    const socket = SocketSingleton.getInstance();
    const { user } = useAuth();
    const api = useAxios();
    const { routeId } = useParams<{ routeId: string }>();

    if (!routeId) return <div>Invalid route</div>;

    const { data: route, isLoading: routeLoading } = useQuery({
        queryKey: ["route", routeId],
        queryFn: async () => {
            const response = await api.get<IResponse<IRouteResponse>>(`route/${routeId}`);
            const responseData: IResponse<IRouteResponse> = response.data;
            if (!responseData.success) {
                toast.error(responseData.message);
                return null;
            }
            return responseData.data;
        }
    });

    const { data: vehicleData } = useQuery({
        queryKey: ["vehicle"],
        queryFn: async () => {
            const response = await api.get<IResponse<IVehicleResponse>>("/user/vehicle");
            const responseData: IResponse<IVehicleResponse> = response.data;
            if (!responseData.success) {
                toast.error(responseData.message);
                return null;
            }
            return responseData.data;
        },
        enabled: user?.role === "rider",
    });

    useEffect(() => {
        if (user?.role !== "rider" || !vehicleData?.vehicleId || !routeId) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                socket.emit("locationUpdate", {
                    vehicleId: vehicleData.vehicleId,
                    routeId,
                    location: {
                        lat: pos.coords.latitude.toString(),
                        long: pos.coords.longitude.toString(),
                    },
                });
            },
            (err) => {
                console.error(err);
                toast.error("Failed to get location");
            },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [user?.role, vehicleData?.vehicleId, routeId, socket]);


    useEffect(() => {
        if (!routeId) return;

        socket.emit("joinRoute", { routeId });

        const handleLocationUpdate = (update: IVehicleLocation) => {
            console.log(update)
            setVehicleLocations(prev => ({
                ...prev,
                [update.vehicleId]: update,
            }));
        };

        socket.on("vehicleLocation", handleLocationUpdate);

        return () => {
            socket.off("vehicleLocation", handleLocationUpdate);
            socket.emit("leaveRoute", routeId);
        };
    }, [routeId, socket]);

    if (routeLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading route...</div>
            </div>
        );
    }

    if (!route) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-red-500">Route not found</div>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-screen">
            <RouteMap
                route={route}
                vehicleLocations={vehicleLocations}
            />
        </div>
    );
};

export default RouteDetail;
