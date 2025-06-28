import { Model, Types } from "mongoose";

export type IBanner = {
    _id?: Types.ObjectId;
    image: string;
}

export type BannerModel = Model<IBanner>;