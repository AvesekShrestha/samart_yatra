import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface RoutingMachineProps {
    start: [number, number];
    end: [number, number];
}

export function RoutingMachine({ start, end }: RoutingMachineProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = (L as any).Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1])
            ],
            lineOptions: {
                styles: [{ color: '#3b82f6', opacity: 0.8, weight: 6 }]
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            createMarker: () => null,
            containerClassName: 'hidden',
        }).addTo(map);

        return () => {
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, start, end]);

    return null;
}
