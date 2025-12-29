import { useState } from "react";
import { Plus, Pencil, Trash2, Map, IndianRupee, BusFront, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RouteForm from "@/components/custom/routeForm";
import type { IResponse } from "@/types/response.type";
import type { IRouteResponse } from "@/types/route.type";

const RouteManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const api = useAxios();
    const queryClient = useQueryClient();

    // 1. Fetch Routes Query
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

    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this route?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900">
                            <Map className="text-blue-600 h-6 w-6" /> Route Management
                        </h1>
                        <p className="text-muted-foreground text-sm">Organize and monitor transit paths and pricing.</p>
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

                {/* Search and Filters */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search routes by name..."
                        className="pl-10 pr-10 bg-white border-slate-200 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow>
                                <TableHead className="w-[300px] font-bold text-slate-700">Route Details</TableHead>
                                <TableHead className="font-bold text-slate-700">Coordinates (Start/End)</TableHead>
                                <TableHead className="font-bold text-slate-700 text-center">Base Fare</TableHead>
                                <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                            <span className="text-slate-500 font-medium">Fetching routes...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredRoutes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <BusFront className="h-12 w-12 mb-2 opacity-20" />
                                            <p>{searchQuery ? "No routes match your search." : "No routes registered yet."}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRoutes.map((route) => (
                                    <TableRow key={route.routeId} className="hover:bg-blue-50/30 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                    <BusFront size={20} />
                                                </div>
                                                <span className="font-bold text-slate-700">{route.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] flex items-center gap-1 text-slate-500 font-mono">
                                                    <span className="text-green-600 font-bold uppercase">Start:</span>
                                                    {Number(route.start.lat).toFixed(3)}, {Number(route.start.long).toFixed(3)}
                                                </div>
                                                <div className="text-[11px] flex items-center gap-1 text-slate-500 font-mono">
                                                    <span className="text-red-500 font-bold uppercase">End:</span>
                                                    {Number(route.end.lat).toFixed(3)}, {Number(route.end.long).toFixed(3)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-100">
                                                <IndianRupee size={12} className="mr-1" />
                                                {route.fair}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:text-blue-600">
                                                    <Pencil size={15} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                                    disabled={deleteMutation.isPending}
                                                    onClick={() => handleDelete(route.routeId)}
                                                >
                                                    {deleteMutation.isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default RouteManagement;
