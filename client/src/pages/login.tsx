import { useState } from "react";
import { useAuth } from "@/context/authContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loginMutation } = useAuth()

    const handleOnClick = async () => {
        await loginMutation.mutate({ email, password })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] px-4 font-sans">
            <div className="w-full max-w-[400px]">
                {/* Minimal Logo/Brand Section */}
                <div className="text-center mb-10">
                    <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        Smarter Nepal
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Sign in to your account</h1>
                    <p className="text-gray-500 text-sm mt-2">Enter your details to access the portal</p>
                </div>

                {/* Simplified Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm"
                                placeholder="name@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider">
                                    Password
                                </label>
                                <button className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                                    Forgot?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleOnClick}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loginMutation.isPending ? "Authenticating..." : "Sign In"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Don't have an account?{" "}
                    <button className="text-gray-900 font-semibold hover:underline">Sign up</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
