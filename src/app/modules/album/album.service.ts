import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IAlbum } from './album.interface';
import { Album } from './album.model';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { FilterQuery } from 'mongoose';

const createAlbum = async (payload: IAlbum): Promise<IAlbum> => {
    const album = await Album.create(payload);
    if (!album) {
        throw new ApiError( StatusCodes.BAD_REQUEST, 'Failed to create album');
    }
    return album;
};

const retrieveAlbumFromDB = async (id: string, query: FilterQuery<any>): Promise<{albums: IAlbum, pagination:any}> => {

    checkMongooseIDValidation(id, "Album");

    const albumsQuery = new QueryBuilder(
        Album.find({package: id}),
        query
    ).paginate()

    const [albums, pagination] = await Promise.all([
        albumsQuery.queryModel.lean().exec(),
        albumsQuery.getPaginationInfo()
    ])

    return { albums, pagination };
};

export const AlbumService = { 
    createAlbum,
    retrieveAlbumFromDB 
};
