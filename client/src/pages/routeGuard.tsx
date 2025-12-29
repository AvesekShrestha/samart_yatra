import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <LoadingScreen />;

    return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;

    return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export const UserOnlyRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;

    return user?.role !== "admin" ? <Outlet /> : <Navigate to="/admin" replace />;
};

export const PublicRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;

    if (user) {
        return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
    }

    return <Outlet />;
};

const LoadingScreen = () => (
    <div className="h-screen flex items-center justify-center bg-[#fcfcfc]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
);
