import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

declare module 'leaflet' {
    namespace Routing {
        function control(options: any): any;
    }
}

interface RoutingMachineProps {
    start: [number, number];
    end: [number, number];
}

export function RoutingMachine({ start, end }: RoutingMachineProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
            routeWhileDragging: false,
            showAlternatives: true,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: () => null,
            lineOptions: {
                styles: [{ color: '#3b82f6', opacity: 0.9, weight: 6 }],
            },
            altLineOptions: {
                styles: [{ color: 'lightgray', opacity: 0.5, weight: 6 }],
            },
        }).addTo(map);


        return () => {
            if (map) {
                map.removeControl(routingControl);
            }
        };
    }, [map, start, end]);

    return null;
}
