import { z } from 'zod';

export const ReminderZodValidationSchema = z.object({
    body: z.object({
        image: z.string({ required_error: 'Image is required' }),
        date: z.string({ required_error: 'Date is required' }),
        time: z.string({ required_error: 'Time is required' })
    })
}); 