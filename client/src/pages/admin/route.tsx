import { useState } from "react";
import { Plus, Pencil, Trash2, Map, IndianRupee, BusFront, Loader2, Search, X, ChevronDown, ChevronUp, MapPin, Hash } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RouteForm from "@/components/custom/routeForm";
import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";

const RouteManagement = () => {
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const api = useAxios();
    const queryClient = useQueryClient();

    const { data: routes = [], isLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const response = await api.get<IResponse<IRouteResponse[]>>("/route");
            if (!response.data.success) {
                toast.error(response.data.message);
                return [];
            }
            return response.data.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete<IResponse<null>>(`/route/${id}`);
            return response.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Route deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["routes"] });
            } else {
                toast.error(res.message);
            }
        },
    });

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Don't toggle the accordion when clicking delete
        if (window.confirm("Are you sure you want to delete this route?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                            <Map className="text-blue-600 h-8 w-8" /> Route Management
                        </h1>
                        <p className="text-slate-500 mt-1">Organize and monitor transit paths and pricing.</p>
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md px-6">
                                <Plus className="mr-2 h-4 w-4" /> Add Route
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Add New Transit Route</DialogTitle>
                            </DialogHeader>
                            <RouteForm onSuccess={() => {
                                setIsModalOpen(false);
                                queryClient.invalidateQueries({ queryKey: ["routes"] });
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search routes by name..."
                        className="pl-10 pr-10 bg-white border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                            <p className="text-slate-500 font-medium">Fetching transit network...</p>
                        </div>
                    ) : filteredRoutes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-slate-400">
                            <BusFront className="h-12 w-12 mb-2 opacity-20" />
                            <p>No routes found.</p>
                        </div>
                    ) : (
                        filteredRoutes.map((route) => (
                            <Card key={route.routeId} className={`overflow-hidden transition-all border-none shadow-sm ring-1 ${expandedRoute === route.routeId ? 'ring-blue-500 shadow-md' : 'ring-slate-200'}`}>
                                <div
                                    className="p-5 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                                    onClick={() => setExpandedRoute(expandedRoute === route.routeId ? null : route.routeId)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${expandedRoute === route.routeId ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                            <BusFront size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{route.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center text-sm font-bold text-green-600">
                                                    <IndianRupee size={14} className="mr-0.5" /> {route.fair}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <MapPin size={12} /> {route.stops?.length || 0} stops
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="hidden md:flex items-center gap-1 text-slate-300 mr-4">
                                            {expandedRoute === route.routeId ? <ChevronUp /> : <ChevronDown />}
                                        </div>
                                        <Button variant="outline" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600" onClick={(e) => e.stopPropagation()}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            disabled={deleteMutation.isPending}
                                            onClick={(e) => handleDelete(e, route.routeId)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {expandedRoute === route.routeId && (
                                    <CardContent className="p-6 border-t bg-slate-50/30 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <MapPin className="h-3 w-3" /> Technical Geometry
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                    <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Start Point</p>
                                                    <p className="text-sm font-mono text-slate-600">{route.start.lat.toFixed(4)}, {route.start.long.toFixed(4)}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                    <p className="text-[10px] font-bold text-red-500 uppercase mb-1">End Point</p>
                                                    <p className="text-sm font-mono text-slate-600">{route.end.lat.toFixed(4)}, {route.end.long.toFixed(4)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Hash className="h-3 w-3" /> System Identifiers
                                            </h4>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Route ID</p>
                                                <p className="text-sm font-mono text-slate-600 break-all">{route.routeId}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteManagement;
