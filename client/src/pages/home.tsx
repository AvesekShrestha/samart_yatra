import type { IResponse } from "@/types/response.type"
import type { IRouteResponse } from "@/types/route.type"
import { useAxios } from "@/utils/axios"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { ArrowRight, BusFront } from "lucide-react"

const Home = () => {
    const api = useAxios()

    const { data, isLoading } = useQuery<IRouteResponse[]>({
        queryKey: ["routes"],
        queryFn: async () => {
            const response = await api.get("/route")
            const responseData = response.data as IResponse<IRouteResponse[]>
            if (responseData.success && responseData.data)
                return responseData.data
            else throw new Error(responseData.message)
        },
    })

    if (isLoading)
        return (
            <div className="p-10 text-center text-gray-400">
                Loading routes...
            </div>
        )

    return (
        <div className="bg-[#FDFDFD] py-12 px-6 min-h-full">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Route Explorer
                    </h1>
                    <p className="text-slate-500">
                        Live public transport network in Nepal
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.map((route) => {
                        const stops = route.stops ?? []

                        return (
                            <Link
                                key={route.routeId}
                                to={`route/${route.routeId}`}
                                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-900 rounded-2xl text-white group-hover:bg-teal-600 transition-colors">
                                        <BusFront size={24} />
                                    </div>
                                    <span className="text-lg font-black text-teal-600">
                                        Rs. {route.fair}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-6">
                                    {route.name}
                                </h2>

                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        Route Path & Stops
                                    </p>

                                    <div className="space-y-0 relative">
                                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 group-hover:bg-teal-50 transition-colors" />

                                        {stops.length > 0 ? (
                                            stops
                                                .slice(0, 3)
                                                .map((stop, index) => (
                                                    <div
                                                        key={`${route.routeId}-stop-${stop.busstopId || index}`}
                                                        className="relative flex items-center gap-4 pb-4"
                                                    >
                                                        <div
                                                            className={`z-10 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${index === 0
                                                                ? "bg-teal-500"
                                                                : "bg-slate-200 group-hover:bg-teal-200"
                                                                }`}
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-700">
                                                                {stop.name}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                {Number(
                                                                    stop
                                                                        .location
                                                                        .lat
                                                                ).toFixed(2)}
                                                                ,{" "}
                                                                {Number(
                                                                    stop
                                                                        .location
                                                                        .long
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-sm text-slate-400 italic py-2">
                                                No intermediate stops listed
                                            </div>
                                        )}

                                        {stops.length > 3 && (
                                            <div className="pl-10 text-xs font-bold text-teal-600">
                                                + {stops.length - 3} more stops
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400 group-hover:text-teal-600 transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-tighter">
                                        View Full Schedule
                                    </span>
                                    <ArrowRight
                                        size={20}
                                        className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                                    />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home
