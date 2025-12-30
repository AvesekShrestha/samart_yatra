import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/utils/axios";
import { toast } from "sonner";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const api = useAxios();

    const pidx = searchParams.get("pidx");
    const transactionId = searchParams.get("transaction_id");

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post(`/trip/payment/verify`, { pidx: id });
            return response.data;
        }
    });

    useEffect(() => {
        if (pidx) {
            verifyMutation.mutate(pidx);
        } else {
            toast.error("Invalid payment session");
            navigate("/");
        }
    }, [pidx]);

    if (verifyMutation.isPending) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Verifying your payment...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">

                <div className="bg-teal-600 p-8 text-center text-white relative">
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Payment Success!</h1>
                    <p className="text-teal-100 text-sm mt-1 opacity-90">Your trip is confirmed</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transaction ID</p>
                                <p className="text-sm font-semibold text-slate-700">{transactionId || pidx?.slice(0, 12)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date & Time</p>
                                <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-dashed border-slate-200" />

                    <div className="space-y-3">
                        <Link
                            to="/history"
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
                        >
                            View Trip History
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/"
                            className="w-full bg-white text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center border border-slate-200 transition-colors hover:bg-slate-50"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Thank you for using Smarter Nepal</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
