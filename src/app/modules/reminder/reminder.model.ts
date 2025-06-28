import { Schema, model } from 'mongoose';
import { IReminder, ReminderModel } from './reminder.interface';

const reminderSchema = new Schema<IReminder, ReminderModel>(
    {
        customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        image: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    },
    { timestamps: true }
);

export const Reminder = model<IReminder, ReminderModel>('Reminder', reminderSchema);