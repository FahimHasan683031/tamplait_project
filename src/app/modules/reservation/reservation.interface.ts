import { Model, Types } from "mongoose"
import { RESERVATION } from "../../../enums/reservation";

export type IReservation = {
    _id?: Types.ObjectId;
    customer: Types.ObjectId;
    vendor: Types.ObjectId;
    package: Types.ObjectId;
    status: RESERVATION;
    guest: number;
    date: String;
    price: number;
    txid: string;
}

export type ReservationModel = Model<IReservation, Record<string, unknown>>;