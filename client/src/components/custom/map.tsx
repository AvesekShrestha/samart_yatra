import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { RoutingMachine } from "./routingMachine";
import { Icon } from "leaflet";
import currentLocationIcon from "@/assets/passanger.png";
import vehicleLocationIcon from "@/assets/vehicle.jpg";

import type { IRouteResponse } from "@/types/route.type";
import type { IVehicleLocation } from "@/pages/routeDetail";

interface RouteMapProps {
    route: IRouteResponse;
    vehicleLocations: Record<string, IVehicleLocation>;
}

const RouteMap = ({ route, vehicleLocations }: RouteMapProps) => {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const CurrentLocationIcon = new Icon({
        iconUrl: currentLocationIcon,
        iconSize: [30, 30],
    });

    const VehicleLocationIcon = new Icon({
        iconUrl: vehicleLocationIcon,
        iconSize: [30, 30],
    });

    const destination: LatLngExpression = [parseFloat(route.end.lat), parseFloat(route.end.long)];
    const start: LatLngExpression = [parseFloat(route.start.lat), parseFloat(route.start.long)];

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported on this device");
            setLoading(false);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
                setLoading(false);
            },
            (err) => {
                console.log("Error getting current position", err);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 10000,
            }
        );

        // Cleanup on unmount
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    if (loading || !position) {
        return <div>Fetching location...</div>;
    }

    return (
        <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Current live location */}
                <Marker position={position} icon={CurrentLocationIcon}>
                    <Popup>Your current location</Popup>
                </Marker>

                {/* Vehicles */}
                {Object.values(vehicleLocations).map((vehicle) => (
                    <Marker
                        key={vehicle.vehicleId}
                        position={[
                            parseFloat(vehicle.location.lat),
                            parseFloat(vehicle.location.long),
                        ]}
                        icon={VehicleLocationIcon}
                    >
                        <Popup>Vehicle: {vehicle.vehicleId}</Popup>
                    </Marker>
                ))}

                {/* Start & Destination */}
                <Marker position={start}>
                    <Popup>Start</Popup>
                </Marker>
                <Marker position={destination}>
                    <Popup>Destination</Popup>
                </Marker>

                {/* Routing line */}
                <RoutingMachine start={start as [number, number]} end={destination as [number, number]} />
            </MapContainer>

            {/* Overlay buttons */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px",
                    zIndex: 1000,
                    backgroundColor: "white",
                    height: "60px",
                    width: "50%",
                    justifyContent: "space-around",
                    alignItems: "center",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
            >
                <button className="map-btn">Option 1</button>
                <button className="map-btn">Option 2</button>
            </div>
        </div>
    );
};

export default RouteMap;
