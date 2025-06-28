import { z } from 'zod';
import { checkZodIDValidation } from '../../../shared/checkZodIDValidation';

export const mediaZodValidationSchema = z.object({
    body: z.object({
        album: checkZodIDValidation("Album Object ID is Required"),
        image: z.string({ required_error: 'Image is required' })
    })
});