import { Model, Types } from "mongoose";

export type IBookmark= {
    _id?: Types.ObjectId,
    customer: Types.ObjectId,
    package: Types.ObjectId
}

export type BookmarkModel = Model<IBookmark>;