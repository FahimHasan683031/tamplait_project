import { Schema, model } from 'mongoose';
import { INote, NoteModel } from './note.interface';

const noteSchema = new Schema<INote, NoteModel>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Note = model<INote, NoteModel>('Note', noteSchema);
