import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { ChevronLeft, Share2, Info, MapPin, QrCode } from "lucide-react";
import { toast } from "sonner";

const ShareQrPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract data passed from RouteMap
    const { vehicleId, routeId, location: userLocation } = location.state || {};

    // Safety check: if accessed directly without state, go back
    if (!vehicleId || !routeId) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">No active session found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-teal-600 text-white px-6 py-2 rounded-xl"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // This is the data the passenger's scanner will read
    const qrData = JSON.stringify({
        vehicleId,
        routeId,
        lat: userLocation?.[0],
        lng: userLocation?.[1],
        timestamp: new Date().toISOString()
    });

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Bus Ticket QR',
                    text: `Scan this to pay for Route ${routeId}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            toast.info("Sharing not supported on this browser");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">Vehicle Ticket QR</h1>
                <button
                    onClick={handleShare}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-teal-600"
                >
                    <Share2 size={22} />
                </button>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
                {/* QR Container */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative group">
                    <div className="bg-white p-4 rounded-2xl">
                        <QRCode
                            value={qrData}
                            size={250}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                            fgColor="#0f172a" // slate-900
                        />
                    </div>

                    {/* Visual Flairs */}
                    <div className="absolute -top-3 -right-3 bg-teal-500 text-white p-2 rounded-lg rotate-12 shadow-lg">
                        <QrCode size={20} />
                    </div>
                </div>

                {/* Details Card */}
                <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Vehicle ID</p>
                                <p className="text-sm font-bold text-slate-700">{vehicleId}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Pickup Location</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {userLocation ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : "Detecting..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm max-w-[250px]">
                    Ask the passenger to scan this QR code to initiate the ticket generation.
                </p>
            </main>

            {/* Footer Static Info */}
            <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping" />
                    Live Session Active
                </div>
            </div>
        </div>
    );
};

export default ShareQrPage;
