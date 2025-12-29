import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { toast } from "sonner";
import { Check, ChevronsUpDown, UserCheck, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import type { IResponse } from "@/types/response.type";

interface VehicleFormProps {
    routeId: string;
    onSuccess: () => void;
}

const VehicleForm = ({ routeId, onSuccess }: VehicleFormProps) => {
    const api = useAxios();
    const queryClient = useQueryClient();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedRider, setSelectedRider] = useState<{ id: string, username: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { data: riders = [], isLoading } = useQuery({
        queryKey: ["riders-search"],
        queryFn: async () => {
            const response = await api.get<IResponse<any[]>>("/user");
            const responseData = response.data;

            if (!responseData.success) {
                toast.error(responseData.message);
                return [];
            }
            const allUsers = responseData.data ?? [];
            return allUsers.filter((u: any) => u.role === "rider");
        }
    });

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            return await api.post(`/route/${routeId}/vehicles`, payload);
        },
        onSuccess: () => {
            toast.success("Vehicle assigned successfully");
            queryClient.invalidateQueries({ queryKey: ["route-vehicles", routeId] });
            onSuccess();
            reset();
            setSelectedRider(null);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to assign vehicle");
        }
    });

    const onSubmit = (data: any) => {
        if (!selectedRider) return toast.error("Please select a rider");
        mutation.mutate({
            vehicleNumber: data.vehicleNumber.toLowerCase(),
            userId: selectedRider.id
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
            <div className="space-y-2">
                <Label htmlFor="vehicleNumber" className="text-slate-600 font-bold">Vehicle Number</Label>
                <Input
                    id="vehicleNumber"
                    {...register("vehicleNumber", { required: "Vehicle number is required" })}
                    placeholder="e.g. ba 2 p 2443"
                    className="uppercase font-mono bg-slate-50 border-slate-200 focus:ring-indigo-500"
                />
                {errors.vehicleNumber && <p className="text-red-500 text-xs">{errors.vehicleNumber.message as string}</p>}
            </div>

            <div className="space-y-2 flex flex-col">
                <Label className="text-slate-600 font-bold">Assign Rider (User)</Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "justify-between bg-slate-50 border-slate-200 font-normal",
                                !selectedRider && "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <UserCheck size={16} className="text-indigo-500" />
                                {selectedRider ? selectedRider.username : "Choose a rider..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search rider by name or email..." />
                            <CommandList>
                                {isLoading ? (
                                    <div className="p-4 flex justify-center items-center gap-2 text-slate-500">
                                        <Loader2 className="animate-spin h-4 w-4" /> Loading riders...
                                    </div>
                                ) : (
                                    <>
                                        <CommandEmpty>No rider found.</CommandEmpty>
                                        <CommandGroup heading="Available Riders">
                                            {riders.map((rider: any) => (
                                                <CommandItem
                                                    key={rider.userId}
                                                    value={rider.username + " " + rider.email}
                                                    onSelect={() => {
                                                        setSelectedRider({ id: rider.userId, username: rider.username });
                                                        setPopoverOpen(false);
                                                    }}
                                                    className="flex items-center justify-between py-3 cursor-pointer"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700">{rider.username}</span>
                                                        <span className="text-[10px] text-slate-400">{rider.email}</span>
                                                    </div>
                                                    <Check className={cn("h-4 w-4 text-indigo-600", selectedRider?.id === rider.userId ? "opacity-100" : "opacity-0")} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 mt-2"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                Assign Vehicle to Route
            </Button>
        </form>
    );
};

export default VehicleForm;
