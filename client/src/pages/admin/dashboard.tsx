import {
    Users,
    Bus,
    Activity,
    TrendingUp,
    MapPin,
    ArrowRight,
    QrCode
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SocketSingleton from "@/utils/socket"
import { useEffect, useState } from "react"

interface ILiveStats {
    routeId: string
    totalVehicles: number
    totalPassengers: number
}

const AdminDashboard = () => {
    const [liveStats, setLiveStats] = useState<ILiveStats[]>([])
    const socket = SocketSingleton.getInstance()

    useEffect(() => {
        socket.emit("fetchStats")

        const handler = (stats: ILiveStats[]) => {
            setLiveStats(stats)
        }

        socket.on("allRouteStats", handler)

        return () => {
            socket.off("allRouteStats", handler)
        }
    }, [])

    const totalPassengers = liveStats.reduce(
        (sum, r) => sum + r.totalPassengers,
        0
    )

    const totalVehicles = liveStats.reduce(
        (sum, r) => sum + r.totalVehicles,
        0
    )

    const activeRoutes = liveStats.length

    const stats = [
        {
            title: "Total Passengers",
            value: totalPassengers.toLocaleString(),
            description: "Live across all routes",
            icon: <Users className="h-5 w-5 text-blue-600" />,
            live: true,
        },
        {
            title: "Active Routes",
            value: activeRoutes.toString(),
            description: "Routes currently online",
            icon: <MapPin className="h-5 w-5 text-green-600" />,
            live: true,
        },
        {
            title: "Total Vehicles",
            value: totalVehicles.toString(),
            description: "Connected vehicles",
            icon: <Bus className="h-5 w-5 text-purple-600" />,
            live: true,
        },
        {
            title: "Live Trips",
            value: totalPassengers.toString(),
            description: "Active passenger sessions",
            icon: <Activity className="h-5 w-5 text-orange-600" />,
            live: true,
        }
    ]

    const routes = liveStats.map((route) => ({
        id: route.routeId,
        name: route.routeId,
        activeVehicles: route.totalVehicles,
        passengers: route.totalPassengers,
        status:
            route.totalVehicles > 100
                ? "High Traffic"
                : route.totalVehicles > 50
                    ? "Normal"
                    : "Low Traffic",
    }))

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    System Overview
                </h1>
                <p className="text-slate-500 font-medium">
                    Monitoring real-time transit data and fleet performance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <div className="text-3xl font-bold text-slate-900">
                                    {stat.value}
                                </div>
                                {stat.live && (
                                    <span className="flex h-3 w-3 items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Route Efficiency</CardTitle>
                        <CardDescription>
                            Real-time passenger load per active route.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {routes.map((route) => (
                                <div
                                    key={route.id}
                                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 rounded-full text-blue-600 group-hover:bg-blue-100 transition-colors">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                {route.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Active Monitoring
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {route.passengers} Pax
                                            </p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                                {route.activeVehicles} Vehicles
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                route.status === "High Traffic"
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className="font-medium"
                                        >
                                            {route.status}
                                        </Badge>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5 text-orange-500" />
                            Recent QR Activity
                        </CardTitle>
                        <CardDescription>
                            Logs from entry/exit scans
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            <div className="relative flex items-center justify-between pl-10">
                                <div className="absolute left-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-full border-4 border-white shadow-sm">
                                    <Activity className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Exit Recorded - Rs. 25
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        User #4492 • Ring Road
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    2 MIN AGO
                                </span>
                            </div>

                            <div className="relative flex items-center justify-between pl-10">
                                <div className="absolute left-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full border-4 border-white shadow-sm">
                                    <QrCode className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        New Entry Scan
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        User #8812 • Jorpati
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    5 MIN AGO
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
