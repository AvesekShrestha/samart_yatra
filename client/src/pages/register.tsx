import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { registerMutation } = useAuth();

    const handleOnClick = async () => {
        await registerMutation.mutate({ username, email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] px-4 font-sans">
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-10">
                    <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        Smarter Nepal
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
                    <p className="text-gray-500 text-sm mt-2">Join the portal to start managing routes</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm"
                                placeholder="John Doe"
                            />
                        </div>

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

                        <div>
                            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            onClick={handleOnClick}
                            disabled={registerMutation.isPending}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                        >
                            {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Already have an account?{" "}
                    <Link to="/login" className="text-gray-900 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
