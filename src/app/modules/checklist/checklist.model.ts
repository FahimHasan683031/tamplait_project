import { Schema, model } from 'mongoose';
import { IChecklist, ChecklistModel } from './checklist.interface';

const checklistSchema = new Schema<IChecklist, ChecklistModel>(
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
        date: {
            type: String,
            required: true
        },
        reminder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

export const Checklist = model<IChecklist, ChecklistModel>('Checklist', checklistSchema);