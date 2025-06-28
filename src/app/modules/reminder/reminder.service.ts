import { StatusCodes } from 'http-status-codes';
import { IReminder } from './reminder.interface';
import { Reminder } from './reminder.model';
import ApiError from '../../../errors/ApiErrors';
import { JwtPayload } from 'jsonwebtoken';
import unlinkFile from '../../../shared/unlinkFile';

const createReminderToDB = async (payload: IReminder): Promise<IReminder> => {
    const result = await Reminder.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create reminder");
    }
    return result;
}

const retrievedReminderFromDB = async (user: JwtPayload): Promise<IReminder | null> => {

    const reminder = await Reminder.findOne({ customer: user.id }).lean().exec();
    return reminder;
}

const updateReminderInDB = async (user: JwtPayload, payload: IReminder): Promise<IReminder | null> => {

    const isExistReminder = await Reminder.findOne({ customer: user.id });
    if (!isExistReminder) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Reminder not found");
    }

    if(payload.image){
        unlinkFile(isExistReminder.image);
    }

    const reminder = await Reminder.findOneAndUpdate(
        { customer: user.id },
        { $set: { ...payload } },
        { new: true }
    ).lean().exec();

    return reminder;
}


export const ReminderService = { createReminderToDB, retrievedReminderFromDB, updateReminderInDB };