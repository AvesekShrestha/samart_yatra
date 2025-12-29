import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import AuthProvider, { useAuth } from "./context/authContext";
import RouteDetail from "@/pages/routeDetail";
import ShareQrPage from "./components/custom/qr";
import Layout from "@/pages/layout";

import AdminDashboard from "@/pages/admin/dashboard";
import RouteManagement from "@/pages/admin/route"
import BusStopManagement from "./pages/admin/busstop";

const AppRoutes = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    return (
        <Routes>
            <Route element={<Login />} path="/login" />

            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route element={<RouteDetail />} path="route/:routeId" />
                <Route element={<ShareQrPage />} path="share-qr" />

                {user?.role === "admin" && (
                    <Route path="admin">
                        <Route index element={<AdminDashboard />} />
                        <Route path="routes" element={<RouteManagement />} />
                        <Route path="busstops" element={<BusStopManagement />} />
                    </Route>
                )}


                <Route
                    path="admin/*"
                    element={<Navigate to={user ? "/" : "/login"} replace />}
                />
            </Route>
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
