import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/authContext";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RouteDetail from "@/pages/routeDetail";
import ShareQrPage from "./components/custom/qr";
import Layout from "@/pages/layout";
import History from "./pages/history";
import PaymentSuccess from "./pages/success";

import AdminDashboard from "@/pages/admin/dashboard";
import RouteManagement from "@/pages/admin/route";
import BusStopManagement from "./pages/admin/busstop";
import VehicleManagement from "./pages/admin/vehicle";

import { ProtectedRoute, AdminRoute, PublicRoute, UserOnlyRoute } from "@/pages/routeGuard";

const AppRoutes = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null

    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>

                    <Route element={<UserOnlyRoute />}>
                        <Route index element={<Home />} />
                        <Route path="route/:routeId" element={<RouteDetail />} />
                        <Route path="share-qr" element={<ShareQrPage />} />
                        <Route path="history" element={<History />} />
                        <Route path="payment/success" element={<PaymentSuccess />} />
                    </Route>

                    <Route element={<AdminRoute />}>
                        <Route path="admin">
                            <Route index element={<AdminDashboard />} />
                            <Route path="routes" element={<RouteManagement />} />
                            <Route path="busstops" element={<BusStopManagement />} />
                            <Route path="vehicles" element={<VehicleManagement />} />
                        </Route>
                    </Route>

                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />}
            />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Toaster position="top-right" richColors />
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;
