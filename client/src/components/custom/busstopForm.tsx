import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { RoutingMachine } from "./routingMachine";

interface BusStopFormProps {
    routeId: string;
    routeStart: [number, number];
    routeEnd: [number, number];
    onSuccess: () => void;
}

const BusStopForm = ({ routeId, routeStart, routeEnd, onSuccess }: BusStopFormProps) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const [isPicking, setIsPicking] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        location: { lat: routeStart[0], long: routeStart[1] }
    });

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return await api.post(`/route/${routeId}/busstops`, payload);
        },
        onSuccess: () => {
            toast.success("Stop registered!");
            queryClient.invalidateQueries({ queryKey: ["routes-with-stops"] });
            onSuccess();
        }
    });

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                if (isPicking) {
                    setFormData(prev => ({
                        ...prev,
                        location: { lat: e.latlng.lat, long: e.latlng.lng }
                    }));
                    setIsPicking(false);
                    toast.success("Stop location set!");
                }
            },
        });
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Stop Name</Label>
                <Input
                    placeholder="e.g. Chymanshing"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <Button
                type="button"
                variant={isPicking ? "destructive" : "outline"}
                className="w-full"
                onClick={() => setIsPicking(!isPicking)}
            >
                <MapPin className={`mr-2 h-4 w-4 ${isPicking ? "animate-pulse" : ""}`} />
                {isPicking ? "Cancel Selection" : "Pick Stop Location on Map"}
            </Button>

            <div className={`h-[350px] w-full rounded-xl border relative overflow-hidden bg-slate-100 ${isPicking ? 'ring-2 ring-blue-500 cursor-crosshair' : ''}`}>
                {isPicking && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] pointer-events-none">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            CLICK ON THE ROUTE TO PLACE STOP
                        </div>
                    </div>
                )}

                <MapContainer center={routeStart} zoom={14} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents />

                    <RoutingMachine start={routeStart} end={routeEnd} />

                    <Marker position={routeStart} />
                    <Marker position={routeEnd} />

                    <Marker
                        position={[formData.location.lat, formData.location.long]}
                        zIndexOffset={1000}
                    />
                </MapContainer>
            </div>

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={mutation.isPending || !formData.name}
                onClick={() => mutation.mutate(formData)}
            >
                {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Save Bus Stop
            </Button>
        </div>
    );
};

export default BusStopForm;
