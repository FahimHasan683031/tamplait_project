import { Model, Types } from 'mongoose';

export type IChecklist = {
    _id?: Types.ObjectId;
    customer: Types.ObjectId;
    title: string;
    date: string;
    reminder: string;
    status: "Pending" | "Completed";
};

export type ChecklistModel = Model<IChecklist>;