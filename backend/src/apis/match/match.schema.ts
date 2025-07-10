import { z } from 'zod';
import { validate as validateUuid } from 'uuid';

export const matchSchema = z.object({
    match_maker_id: z.string().refine(val => validateUuid(val), {
        message: 'Invalid match_maker_id'
    }),
    match_receiver_id: z.string().refine(val => validateUuid(val), {
        message: 'Invalid match_receiver_id'
    })
});
