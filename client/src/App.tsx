import { Toaster } from "sonner"
import { Routes, Route } from "react-router-dom"
import Home from "@/pages/route"
import Login from "@/pages/login"
import AuthProvider from "./context/authContext"
import RouteDetail from "@/pages/routeDetail"
import RouteMap from "./components/custom/map"

const App = () => {

    return (
        <>
            <AuthProvider>
                <Toaster />
                <Routes>
                    <Route element={<RouteDetail />} path="/route/:routeId" />
                    <Route element={<Home />} path="/" />
                    <Route element={<Login />} path="/login" />
                    <Route element={<RouteMap />} path="/map" />
                </Routes>
            </AuthProvider>
        </>
    )
}

export default App
