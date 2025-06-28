import { Schema, model } from "mongoose";
import { IReservation, ReservationModel } from "./reservation.interface";
import { randomBytes } from "crypto";
import { RESERVATION } from "../../../enums/reservation";

const ReservationSchema = new Schema<IReservation, ReservationModel>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },
        status: {
            type: String,
            enum: Object.values(RESERVATION),
            default: RESERVATION.Pending 
        },
        guest: { type: Number, required: true },
        date: { type: String, required: true },
        price: { type: Number, required: true },
        txid: { type: String, unique: true }
    },
    { timestamps: true }
);

// Compound Indexes for Efficient Filtering
ReservationSchema.index({ vendor: 1, status: 1 });
ReservationSchema.index({ customer: 1, status: 1 });

// Generate Unique Transaction ID Before Saving
ReservationSchema.pre("save", async function (next) {
    const reservation = this;

    if (reservation.isNew && !reservation.txid) {
        const prefix = "tx_";
        const uniqueId = randomBytes(8).toString("hex");
        reservation.txid = `${prefix}${uniqueId}`;
    }
    next();
});

export const Reservation = model<IReservation, ReservationModel>("Reservation", ReservationSchema);
