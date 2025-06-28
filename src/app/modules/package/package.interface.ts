import { Model, Types } from "mongoose";
import { PACKAGE } from "../../../enums/package";

export type IPackage = {
    _id?: Types.ObjectId;
    vendor: Types.ObjectId;
    name: string;
    price: number;
    category: Types.ObjectId;
    location: string;
    city: string;
    image: string;
    about: string;
    capacity: number;
    outdoor?: number;
    indoor?: number;
    status: PACKAGE;
}

export type PackageModel = Model<IPackage, Record<string, unknown>>; 