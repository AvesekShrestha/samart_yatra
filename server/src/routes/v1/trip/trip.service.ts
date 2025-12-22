import { IPaymentRequest, IPaymentResponse } from "../../../types/payment.type";
import { IQrScanResponse, ITripRequest, ZodTrip, zodTripSchema } from "../../../types/trip.type";
import TripRepository from "./trip.repository";
import axios from "axios";
import { payment_key } from "../../../config/constants";
import mongoose from "mongoose";
import { BadRequestError, UnauthorizedError } from "../../../types/error.type";

const TripService = {

    async handleQrScan(payload: ZodTrip, userId: string): Promise<IQrScanResponse> {

        const result = zodTripSchema.safeParse(payload);
        if (!result.success) throw result.error;
        if (!userId) throw new UnauthorizedError("userId not found")

        const session = await mongoose.startSession();

        try {
            const trip = await TripRepository.tripExists(userId, payload.vehicle, session);
            let response: IQrScanResponse;

            if (!trip) {
                session.startTransaction();

                const tripPayload: ITripRequest = {
                    boardingStop: payload.boardingStop,
                    vehicle: payload.vehicle,
                    user: userId
                };
                const data = await TripRepository.create(tripPayload, session);

                await session.commitTransaction();

                response = {
                    type: "newRide",
                    trip: {
                        tripId: data._id.toString(),
                        boardingStop: data.boardingStop,
                    }
                };
                return response;
            } else {
                session.startTransaction();

                trip.exitStop = payload.exitStop;
                trip.paymentStatus = "pending";
                trip.fare = 25;
                await trip.save({ session });

                const paymentRequestPayload: IPaymentRequest = {
                    return_url: "http://localhost:5173/payment/success",
                    website_url: "http://localhost:5173",
                    amount: trip.fare * 100,
                    purchase_order_id: `payment-id-${trip._id.toString()}`,
                    purchase_order_name: "Fare Payment",
                    product_details: [{
                        identity: trip._id.toString(),
                        name: `${trip.vehicle.vehicleNumber}`,
                        total_price: trip.fare * 100,
                        quantity: 1,
                        unit_price: trip.fare * 100
                    }]
                };

                console.log(paymentRequestPayload)
                console.log(payment_key)

                console.log(`Key ${payment_key}`)
                const paymentResponse = await axios.post<IPaymentResponse>(
                    "https://dev.khalti.com/api/v2/epayment/initiate/",
                    paymentRequestPayload,
                    {
                        headers: {
                            Authorization: `Key ${payment_key}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                await session.commitTransaction();

                response = {
                    type: "payment",
                    payment: paymentResponse.data
                };

                return response;
            }

        } catch (error: any) {
            await session.abortTransaction();
            if (axios.isAxiosError(error)) {
                console.log(error.message)
                console.log("Here is the issue")
                throw new BadRequestError(`Payment initiation failed: ${error.message}`);
            }
            console.log(error.message)
            throw error;

        } finally {
            session.endSession();
        }
    }
};

export default TripService;
