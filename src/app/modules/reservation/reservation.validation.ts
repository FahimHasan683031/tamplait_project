import { z } from 'zod';
import { checkZodIDValidation } from '../../../shared/checkZodIDValidation';

export const ReservationZodValidationSchema = z.object({
    body: z.object({
        package: checkZodIDValidation("Package Object Id"),
        guest: z.number({ required_error: "Guest is required" }),
        date: z.string({ required_error: "Date is required" }),
    })
})
