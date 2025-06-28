import { z } from 'zod';
import { checkZodIDValidation } from '../../../shared/checkZodIDValidation';

export const packageZodValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name Is Required' }),
        price: z.number({ required_error: 'Price Is Required' }),
        category: checkZodIDValidation("Category Is Required"),
        location: z.string({ required_error: 'Location Is Required' }),
        city: z.string({ required_error: 'City Is Required' }),
        image: z.string({ required_error: 'Image Is Required' }),
        about: z.string({ required_error: 'About Is Required' }),
        capacity: z.number({ required_error: 'Capacity Is Required' }),
        outdoor: z.number().optional(),
        indoor: z.number().optional()
    })
});
