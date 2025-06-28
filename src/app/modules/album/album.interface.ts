import { Model, Types } from 'mongoose';

export type IAlbum = {
  _id?: Types.ObjectId;
  name: string;
  image: string;
  vendor: Types.ObjectId;
  package: Types.ObjectId;
};

export type AlbumModel = Model<IAlbum>;