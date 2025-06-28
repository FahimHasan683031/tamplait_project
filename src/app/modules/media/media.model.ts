import { model, Schema } from 'mongoose';
import { IMedia, MediaModel } from './media.interface';

const mediaSchema = new Schema<IMedia, MediaModel>(
  {
    image: {
      type: String,
      required: true,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      required: true
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true
    },
  },
  { timestamps: true }
);

export const Media = model<IMedia, MediaModel>('Media', mediaSchema);
