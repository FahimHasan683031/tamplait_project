import { Model, Types } from 'mongoose';

export type IMedia = {
  _id?: Types.ObjectId;
  image: string;
  album: Types.ObjectId;
  vendor: Types.ObjectId;
  package: Types.ObjectId;
};

export type MediaModel = Model<IMedia>;