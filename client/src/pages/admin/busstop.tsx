import { useState } from "react";
import { Plus, MapPin, Loader2, Search, Bus, Map as MapIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";
import BusStopForm from "@/components/custom/busstopForm";

const BusStopManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<{ id: string, name: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const api = useAxios();
    const queryClient = useQueryClient();

    // Fetching the combined data
    const { data: routes = [], isLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const res = await api.get<IResponse<IRouteResponse[]>>("/route");
            return res.data.success ? res.data.data : [];
        }
    });

    // Flatten all stops to show them in a master list if needed, 
    // or just filter routes to show their specific stops
    const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold flex items-center gap-2">
                            <Bus className="text-blue-600" /> Bus Stop Master List
                        </h1>
                        <p className="text-muted-foreground text-sm">View and manage stops for all registered routes.</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by Route Name..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Routes & Stops Table */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[200px]">Route</TableHead>
                                <TableHead>Stops Registered</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                            ) : filteredRoutes.map((route) => (
                                <TableRow key={route.routeId} className="group">
                                    <TableCell className="align-top">
                                        <div className="font-bold text-slate-700 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            {route.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{route.routeId}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {route.stops && route.stops.length > 0 ? (
                                                route.stops.map((stop) => (
                                                    <span key={stop.busstopId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        <MapPin size={12} className="mr-1" /> {stop.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No stops added yet</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right align-top">
                                        <Dialog open={isModalOpen && selectedRoute?.id === route.routeId} onOpenChange={(open) => {
                                            if (!open) setIsModalOpen(false);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-600 hover:text-white transition-all"
                                                    onClick={() => {
                                                        setSelectedRoute({ id: route.routeId, name: route.name });
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" /> Add Stop
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <MapIcon className="h-5 w-5 text-blue-600" />
                                                        Add Stop to {route.name}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {selectedRoute && (
                                                    <BusStopForm
                                                        routeId={selectedRoute.id}
                                                        onSuccess={() => {
                                                            setIsModalOpen(false);
                                                            queryClient.invalidateQueries({ queryKey: ["routes-with-stops"] });
                                                        }}
                                                    />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default BusStopManagement;
