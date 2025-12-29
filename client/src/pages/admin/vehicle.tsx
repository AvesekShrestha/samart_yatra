import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { Plus } from "lucide-react";

const VehicleManagement = () => {
    const api = useAxios();

    const { data: vehicles, isLoading } = useQuery({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await api.get("/vehicle");
            return res.data.data;
        }
    });

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
                    <p className="text-slate-500 text-sm">Manage your fleet and assignments</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition-all">
                    <Plus size={18} /> Add Vehicle
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Vehicle No.</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Current Route</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vehicles?.map((v: any) => (
                            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium font-mono text-slate-700">{v.number}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">Active</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{v.routeName || "Unassigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehicleManagement;
