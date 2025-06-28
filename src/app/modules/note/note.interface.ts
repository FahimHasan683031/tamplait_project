import { Model, Types } from 'mongoose';

export type INote = {
    _id?: Types.ObjectId;
    customer: Types.ObjectId;
    title: string;
    description: string;
    
};

export type NoteModel = Model<INote>;