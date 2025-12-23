import { Toaster } from "sonner"
import { Routes, Route } from "react-router-dom"
import Home from "@/pages/route"
import Login from "@/pages/login"
import AuthProvider from "./context/authContext"

const App = () => {

    return (
        <>
            <AuthProvider>
                <Toaster />
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<Login />} path="/login" />
                </Routes>
            </AuthProvider>
        </>
    )
}

export default App
