import { z } from 'zod';

export const ChecklistZodSchemaValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        date: z.string({ required_error: 'Date is required' }),
        reminder: z.string({ required_error: 'Reminder is required' }),
    })
});
