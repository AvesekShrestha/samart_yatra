import { IAccessTokenPayload } from "./token.type";

declare global {
    namespace Express {
        interface Request {
            user?: IAccessTokenPayload;
        }
    }
}
