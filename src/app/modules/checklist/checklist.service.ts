import { FilterQuery } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { IChecklist } from './checklist.interface';
import { Checklist } from './checklist.model';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';

const createChecklistToDB = async (payload: IChecklist): Promise<IChecklist> => {
    const result = await Checklist.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create checklist');
    }
    return result;
}

const retrievedChecklistFromDB = async (user: JwtPayload, query: FilterQuery<any>): Promise<{ checklist: IChecklist[], pagination: any }> => {
    const checklistQuery = new QueryBuilder(
        Checklist.find({ customer: user.id }),
        query
    ).paginate();

    const [checklist, pagination] = await Promise.all([
        checklistQuery.queryModel.lean().exec(),
        checklistQuery.getPaginationInfo()
    ]);

    return { checklist, pagination };
}

const completeChecklistToDB = async (id: string): Promise<IChecklist> => {
    checkMongooseIDValidation(id, "Checklist");

    const result = await Checklist.findByIdAndUpdate(
        id,
        { status: "Completed" },
        { new: true }
    );
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to complete checklist');
    }
    return result;
}

export const ChecklistService = { createChecklistToDB, retrievedChecklistFromDB, completeChecklistToDB };