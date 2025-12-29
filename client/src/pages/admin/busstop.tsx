import { useState } from "react";
import { Plus, Loader2, Search, Bus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";
import BusStopForm from "@/components/custom/busstopForm";

const BusStopManagement = () => {
    const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<IRouteResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const api = useAxios();
    const queryClient = useQueryClient();

    const { data: routes = [], isLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const res = await api.get<IResponse<IRouteResponse[]>>("/route");
            return res.data.success ? res.data.data : [];
        }
    });

    const deleteStopMutation = useMutation({
        mutationFn: async ({ routeId, stopId }: { routeId: string, stopId: string }) => {
            return await api.delete(`/route/${routeId}/busstops/${stopId}`);
        },
        onSuccess: () => {
            toast.success("Bus stop removed");
            queryClient.invalidateQueries({ queryKey: ["routes"] });
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
                            <Bus className="h-8 w-8 text-blue-600" /> Bus Stop Manager
                        </h1>
                        <p className="text-slate-500 mt-1">Configure boarding points and stop sequences for your routes.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find a route..."
                            className="pl-10 bg-white border-slate-200 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                        <p className="text-slate-500 font-medium">Loading routes and stops...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRoutes.map((route) => {
                            const stopsList = route.stops || [];

                            return (
                                <Card key={route.routeId} className={`overflow-hidden transition-all border-none shadow-sm ring-1 ${expandedRoute === route.routeId ? 'ring-blue-500 shadow-md' : 'ring-slate-200'}`}>
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                                        onClick={() => setExpandedRoute(expandedRoute === route.routeId ? null : route.routeId)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                {expandedRoute === route.routeId ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">{route.name}</h3>
                                                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{stopsList.length} Stops Registered</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Dialog
                                                open={isModalOpen && selectedRoute?.routeId === route.routeId}
                                                onOpenChange={(open) => { if (!open) { setIsModalOpen(false); setSelectedRoute(null); } }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRoute(route);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" /> Add Stop
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader><DialogTitle>New Stop for {route.name}</DialogTitle></DialogHeader>
                                                    {selectedRoute && (
                                                        <BusStopForm
                                                            routeId={selectedRoute.routeId}
                                                            routeStart={[selectedRoute.start.lat, selectedRoute.start.long]}
                                                            routeEnd={[selectedRoute.end.lat, selectedRoute.end.long]}
                                                            onSuccess={() => {
                                                                setIsModalOpen(false);
                                                                setSelectedRoute(null);
                                                                queryClient.invalidateQueries({ queryKey: ["routes"] });
                                                            }}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>

                                    {expandedRoute === route.routeId && (
                                        <CardContent className="p-0 border-t bg-slate-50/50 animate-in slide-in-from-top-1 duration-200">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent border-none">
                                                        <TableHead className="pl-6 h-10 text-[11px] uppercase font-bold text-slate-400">Stop Name</TableHead>
                                                        <TableHead className="h-10 text-[11px] uppercase font-bold text-slate-400">Coordinates</TableHead>
                                                        <TableHead className="text-right pr-6 h-10 text-[11px] uppercase font-bold text-slate-400">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {stopsList.length > 0 ? stopsList.map((stop) => (
                                                        <TableRow key={stop.busstopId} className="bg-white hover:bg-blue-50/30 border-slate-100">
                                                            <TableCell className="pl-6 font-semibold text-slate-700">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-2 rounded-full bg-red-400" />
                                                                    {stop.name}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs font-mono text-slate-500">
                                                                {stop.location.lat.toFixed(4)}, {stop.location.long.toFixed(4)}
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6 space-x-1">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                                    onClick={() => deleteStopMutation.mutate({ routeId: route.routeId, stopId: stop.busstopId })}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="h-24 text-center text-slate-400 italic">
                                                                No stops added to this route yet.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusStopManagement;
