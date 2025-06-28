import { model, Schema } from 'mongoose';
import { AlbumModel, IAlbum } from './album.interface';
import config from '../../../config';

const albumSchema = new Schema<IAlbum, AlbumModel>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    }
  },
  { timestamps: true }
);


/* albumSchema.post('find', function (docs: any) {
  docs.forEach((doc: any) => {
    if (doc.image && !doc.image.startsWith('http')) { 
      doc.image = `http://${config.ip_address}:${config.port}${doc.image}`;
    }
  });
}); */



export const Album = model<IAlbum, AlbumModel>('Album', albumSchema);