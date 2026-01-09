import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Navigation2, Info, X, Loader2 } from "lucide-react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useAxios } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

import { RoutingMachine } from "./routingMachine";
import vehicleIconImg from "@/assets/vehicle.jpg";
import currentLocationIconImg from "@/assets/current.png";
import busstopIconImg from "@/assets/busstop.png";

import type { IRouteResponse } from "@/types/route.type";
import type { IVehicleLocation } from "@/pages/routeDetail";
import type { IScanResponse, ITripRequest } from "@/types/trip.type";
import type { IResponse } from "@/types/response.type";

interface RouteMapProps {
    route: IRouteResponse;
    vehicleLocations: Record<string, IVehicleLocation>;
    userPosition: [number, number] | null;
    isLocating: boolean;
    currentVehicleId?: string;
}

const MapLogic = ({ position, recenterTrigger }: { position: [number, number] | null, recenterTrigger: number }) => {
    const map = useMap();
    useEffect(() => {
        if (recenterTrigger > 0 && position) {
            map.flyTo(position, 16, { duration: 1.5 });
        }
    }, [recenterTrigger, position, map]);
    return null;
};

const RouteMap = ({ route, vehicleLocations, userPosition, isLocating, currentVehicleId }: RouteMapProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showScanner, setShowScanner] = useState(false);
    const [recenterCount, setRecenterCount] = useState(0);

    const start: LatLngExpression = [Number(route.start.lat), Number(route.start.long)];
    const destination: LatLngExpression = [Number(route.end.lat), Number(route.end.long)];
    const api = useAxios()

    const icons = {
        user: new L.Icon({ iconUrl: currentLocationIconImg, iconSize: [36, 36], iconAnchor: [18, 18], className: "rounded-full border-2 border-white" }),
        vehicle: new L.Icon({ iconUrl: vehicleIconImg, iconSize: [36, 36], iconAnchor: [18, 18], className: "rounded-full border-2 border-white" }),
        stop: new L.Icon({ iconUrl: busstopIconImg, iconSize: [32, 32], iconAnchor: [16, 16] })
    };

    const handleMainAction = () => {
        if (user?.role === 'rider') {
            if (!currentVehicleId) return toast.error("Vehicle data not found");
            navigate("/share-qr", { state: { vehicleId: currentVehicleId, routeId: route.routeId, location: userPosition } });
        } else {
            setShowScanner(true);
        }
    };

    const scanMutation = useMutation({
        mutationFn: async (payload: ITripRequest) => {
            const response = await api.post<IResponse<IScanResponse>>(`/trip`, payload)
            return response.data as IResponse<IScanResponse>

        },
        onSuccess: (response: IResponse<IScanResponse>) => {
            if (response.success) {
                toast.success(response.message);
                setShowScanner(false);

                if (response.data?.type === "payment") {
                    const paymentUrl = response.data.payment?.data?.payment_url;

                    if (paymentUrl) {
                        window.open(paymentUrl, "_blank", "noopener,noreferrer");

                    } else {
                        toast.error("Payment URL not found. Please check your history.");
                    }
                }
            } else {
                toast.error(response.message);
            }
        },
        onError: (error: any) => {
            const errMsg = error.response?.data?.message || "Something went wrong during scan";
            toast.error(errMsg, { id: "scan-toast" });
        }
    })

    const handleOnScan = (result: any[]) => {
        if (result.length > 0) {
            const rawData = result[0].rawValue;

            try {
                const parsedData = JSON.parse(rawData);

                if (parsedData.vehicleId && parsedData.routeId) {
                    toast.success("Vehicle identified!");
                    setShowScanner(false);

                    const data: ITripRequest = {
                        location: {
                            lat: parsedData.lat,
                            long: parsedData.long
                        },
                        vehicle: parsedData.vehicleId
                    }
                    scanMutation.mutate(data)

                } else {
                    toast.error("Invalid QR: Missing vehicle or route information.");
                }
            } catch (error) {
                console.error("QR Parse Error:", error);
                toast.error("Invalid QR format. Please scan a valid Smarter Nepal QR.");
            }
        }
    };
    return (
        <div className="relative h-full w-full flex-1 overflow-hidden font-sans">
            <MapContainer center={start} zoom={14} className="h-full w-full z-0" zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                <MapLogic position={userPosition} recenterTrigger={recenterCount} />

                {userPosition && <Marker position={userPosition} icon={icons.user} />}

                {route.stops?.map((stop) => (
                    <Marker key={stop.busstopId} position={[Number(stop.location.lat), Number(stop.location.long)]} icon={icons.stop}>
                        <Popup><div className="text-xs font-bold">{stop.name}</div></Popup>
                    </Marker>
                ))}

                {Object.values(vehicleLocations).map((v) => (
                    <Marker key={v.vehicleId} position={[Number(v.location.lat), Number(v.location.long)]} icon={icons.vehicle}>
                        <Popup><div className="text-xs font-bold uppercase">Bus:{v.vehicleId}</div></Popup>
                    </Marker>
                ))}

                <RoutingMachine start={start as [number, number]} end={destination as [number, number]} />
            </MapContainer>

            {isLocating && !userPosition && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border">
                    <Loader2 className="animate-spin text-teal-600" size={14} />
                    <span className="text-xs text-slate-600 font-medium">Getting GPS lock...</span>
                </div>
            )}

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-md">
                <div className="bg-white/95 backdrop-blur-md border shadow-xl rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">{route.name}</h2>
                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                            Fare: Rs. {route.fair} • {route.stops?.length ?? 0} Stops
                        </p>
                    </div>
                    <button className="p-2 bg-slate-50 rounded-full text-slate-400"><Info size={18} /></button>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm">
                <div className="bg-slate-900/95 shadow-2xl rounded-[2rem] p-2 flex items-center gap-2 border border-white/10">
                    <button onClick={handleMainAction} className="flex-1 bg-teal-500 text-white font-bold py-4 px-6 rounded-[1.75rem] flex items-center justify-center gap-3 transition-all active:scale-95">
                        <QrCode size={22} />
                        <span>{user?.role === 'rider' ? "Share QR Code" : "Scan for Ticket"}</span>
                    </button>
                    <button onClick={() => userPosition ? setRecenterCount(c => c + 1) : toast.info("Waiting for GPS...")} className="bg-slate-800 text-white p-4 rounded-2xl">
                        <Navigation2 size={22} className={`rotate-45 ${isLocating ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </div>

            {showScanner && (
                <div className="absolute inset-0 z-[2000] bg-black flex flex-col">
                    <div className="p-6 flex justify-between items-center text-white">
                        <h2 className="text-lg font-bold">Scan Vehicle QR</h2>
                        <button onClick={() => setShowScanner(false)}><X size={24} /></button>
                    </div>
                    <Scanner onScan={(result) => handleOnScan(result)} />
                </div>
            )}
        </div>
    );
};

export default RouteMap;
