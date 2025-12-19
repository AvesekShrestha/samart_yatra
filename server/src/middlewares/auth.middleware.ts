import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../types/error.type";
import { verifyToken } from "../utils/token";


export const protect = (...allowedRoles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader?.startsWith("Bearer ")) {
                throw new UnauthorizedError("No token provided")
            }

            const accessToken = authHeader.split(" ")[1]

            if (!accessToken) throw new UnauthorizedError("Unauthorized : Invalid token format")

            const decoded: any = verifyToken(accessToken);
            (req as any).user = decoded;

            if (!allowedRoles.includes(decoded.role)) throw new UnauthorizedError("You are unauthorized to access")

            next()

        } catch (error: any) {
            next(new UnauthorizedError("Unauthorized: Invalid or expired token"))
        }
    }
}
