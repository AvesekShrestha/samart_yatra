import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";

// Import your existing component
import { RoutingMachine } from "./routingMachine";

import type { IResponse } from "@/types/response.type";
import type { IRouteRequest, IRouteResponse } from "@/types/route.type";

const RouteForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const [picking, setPicking] = useState<"start" | "end" | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        fair: 20,
        start: { lat: 27.7172, long: 85.3240 },
        end: { lat: 27.7000, long: 85.3000 },
    });

    const addMutation = useMutation({
        mutationFn: async (payload: IRouteRequest) => {
            const response = await api.post<IResponse<IRouteResponse>>("/route", payload);
            return response.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Route added successfully!");
                queryClient.invalidateQueries({ queryKey: ["routes"] });
                onSuccess();
            } else {
                toast.error(res.message || "Failed to add route");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    });

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                if (picking) {
                    setFormData(prev => ({
                        ...prev,
                        [picking]: { lat: e.latlng.lat, long: e.latlng.lng }
                    }));
                    setPicking(null);
                    toast.info(`${picking.charAt(0).toUpperCase() + picking.slice(1)} set!`);
                }
            },
        });
        return null;
    };

    const handleAddRoute = () => {
        if (!formData.name.trim()) return toast.error("Route name is required");

        addMutation.mutate({
            name: formData.name,
            start: formData.start,
            end: formData.end,
            fair: formData.fair
        });
    };

    return (
        <div className="space-y-5">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Route Name</Label>
                    <Input
                        placeholder="e.g. Kalanki - Ratnapark"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Base Fare (NPR)</Label>
                    <Input
                        type="number"
                        value={formData.fair}
                        onChange={(e) => setFormData({ ...formData, fair: Number(e.target.value) })}
                    />
                </div>
            </div>

            {/* Picker Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant={picking === 'start' ? "destructive" : "outline"}
                    onClick={() => setPicking('start')}
                    className="flex gap-2"
                >
                    <MapPin className={`h-4 w-4 ${picking === 'start' ? "animate-pulse" : "text-green-600"}`} />
                    {picking === 'start' ? "Click Map..." : "Set Start"}
                </Button>
                <Button
                    type="button"
                    variant={picking === 'end' ? "destructive" : "outline"}
                    onClick={() => setPicking('end')}
                    className="flex gap-2"
                >
                    <Navigation className={`h-4 w-4 ${picking === 'end' ? "animate-pulse" : "text-red-600"}`} />
                    {picking === 'end' ? "Click Map..." : "Set End"}
                </Button>
            </div>

            {/* Map Preview */}
            <div className={`h-[350px] w-full rounded-xl border relative overflow-hidden shadow-inner bg-slate-100 transition-all ${picking ? 'ring-2 ring-blue-500 cursor-crosshair' : ''}`}>

                {/* Floating Instruction Badge (Top Center) */}
                {picking && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-sm border border-white/20">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-wide uppercase">
                                Select {picking} Point on Map
                            </span>
                        </div>
                    </div>
                )}

                <MapContainer center={[27.7172, 85.3240]} zoom={13} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents />

                    <Marker position={[formData.start.lat, formData.start.long]} />
                    <Marker position={[formData.end.lat, formData.end.long]} />

                    <RoutingMachine
                        start={[formData.start.lat, formData.start.long]}
                        end={[formData.end.lat, formData.end.long]}
                    />
                </MapContainer>

                {/* Map Overlay for 'Picking' State */}
                {picking && (
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-[1000]" />
                )}
            </div>
            {/* Submit Button */}
            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                onClick={handleAddRoute}
                disabled={addMutation.isPending}
            >
                {addMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Add Route
            </Button>
        </div>
    );
};

export default RouteForm;
