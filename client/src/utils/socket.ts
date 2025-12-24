import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

class SocketSingleton {
    private static instance: Socket;

    private constructor() { }

    public static getInstance(): Socket {
        if (!SocketSingleton.instance) {
            SocketSingleton.instance = io(SOCKET_URL, {
                transports: ["websocket"],
                autoConnect: true,
            });
        }
        return SocketSingleton.instance;
    }
}

export default SocketSingleton;
