import { z } from 'zod';
import { checkZodIDValidation } from '../../../shared/checkZodIDValidation';

export const albumZodValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        image: z.string({ required_error: 'Image is required' }),
        package: checkZodIDValidation("Package is required")
    })
});
