import { ClientSession } from "mongoose";
import Trip from "../../../models/trip.model";
import { ITripRequest } from "../../../types/trip.type";
import { IUserResponse } from "../../../types/user.type";
import { IVehicleResponse } from "../../../types/vehicle.type";

const TripRepository = {
    async create(payload: ITripRequest, session?: ClientSession) {
        const trip = new Trip({
            boardingStop: payload.boardingStop,
            vehicle: payload.vehicle,
            user: payload.user,
        });
        await trip.save({ session });
        return trip;
    },

    async tripExists(userId?: string, vehicleId?: string, session?: ClientSession) {
        const trip = await Trip.findOne({
            user: userId,
            vehicle: vehicleId,
            exitStop: null,
        })
            .populate<{ user: IUserResponse; vehicle: IVehicleResponse }>(
                "user vehicle"
            )
            .session(session || null);

        if (!trip) return null;
        return trip;
    },
};

export default TripRepository;
