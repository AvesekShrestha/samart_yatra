import { useState } from "react";
import { Plus, Loader2, Search, Car, Trash2, ChevronDown, ChevronUp, User, Hash } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";
import VehicleForm from "@/components/custom/vehicleForm";

const VehicleManagement = () => {
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<IRouteResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const api = useAxios();

    const { data: routes = [], isLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const res = await api.get<IResponse<IRouteResponse[]>>("/route");
            return res.data.success ? res.data.data : [];
        }
    });

    const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                            <Car className="h-8 w-8 text-indigo-600" /> Vehicle Fleet
                        </h1>
                        <p className="text-slate-500 mt-1">Assign riders and vehicles to specific transit routes.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find a route..."
                            className="pl-10 bg-white border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-slate-500">Loading transit network...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRoutes.map((route) => (
                            <Card key={route.routeId} className={`overflow-hidden transition-all border-none shadow-sm ring-1 ${expandedRoute === route.routeId ? 'ring-indigo-500 shadow-md' : 'ring-slate-200'}`}>
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50"
                                    onClick={() => setExpandedRoute(expandedRoute === route.routeId ? null : route.routeId)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${expandedRoute === route.routeId ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {expandedRoute === route.routeId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{route.name}</h3>
                                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-tighter">
                                                ID: {route.routeId.slice(-6)}
                                            </span>
                                        </div>
                                    </div>

                                    <Dialog
                                        open={isModalOpen && selectedRoute?.routeId === route.routeId}
                                        onOpenChange={(open) => { if (!open) { setIsModalOpen(false); setSelectedRoute(null); } }}
                                    >
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRoute(route);
                                                setIsModalOpen(true);
                                            }}>
                                                <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader><DialogTitle>Assign Vehicle to {route.name}</DialogTitle></DialogHeader>
                                            {selectedRoute && (
                                                <VehicleForm
                                                    routeId={selectedRoute.routeId}
                                                    onSuccess={() => {
                                                        setIsModalOpen(false);
                                                        setSelectedRoute(null);
                                                    }}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {expandedRoute === route.routeId && (
                                    <CardContent className="p-0 border-t bg-slate-50/50">
                                        <RouteVehiclesTable routeId={route.routeId} />
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const RouteVehiclesTable = ({ routeId }: { routeId: string }) => {
    const api = useAxios();
    const queryClient = useQueryClient();

    const { data: vehicles = [], isLoading } = useQuery({
        queryKey: ["route-vehicles", routeId],
        queryFn: async () => {
            const res = await api.get<IResponse<any[]>>(`/route/${routeId}/vehicles`);
            return res.data.success ? res.data.data : [];
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (vId: string) => api.delete(`/route/${routeId}/vehicles/${vId}`),
        onSuccess: () => {
            toast.success("Vehicle removed");
            queryClient.invalidateQueries({ queryKey: ["route-vehicles", routeId] });
        }
    });

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>;

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="pl-6 h-10 text-[11px] uppercase font-bold text-slate-400">Vehicle Number</TableHead>
                    <TableHead className="h-10 text-[11px] uppercase font-bold text-slate-400">Assigned Rider</TableHead>
                    <TableHead className="text-right pr-6 h-10 text-[11px] uppercase font-bold text-slate-400">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehicles.length > 0 ? vehicles.map((v) => (
                    <TableRow key={v.vehicleId} className="bg-white hover:bg-indigo-50/30">
                        <TableCell className="pl-6 font-bold text-slate-700 uppercase italic">
                            <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-indigo-400" />
                                {v.vehicleNumber}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                                    <User size={14} className="text-slate-400" /> {v.user?.username}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-5">{v.user?.email}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-300 hover:text-red-600"
                                onClick={() => deleteMutation.mutate(v.vehicleId)}
                                disabled={deleteMutation.isPending}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-slate-400 italic">No vehicles assigned to this route.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default VehicleManagement;
