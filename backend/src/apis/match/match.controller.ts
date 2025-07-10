import type { Request, Response } from 'express';
import { sql } from '../../utils/database.utils';
import { matchSchema } from './match.schema.ts';

export async function postMatchController(req: Request, res: Response): Promise<void> {
    const validation = matchSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            message: 'Invalid match data',
            errors: validation.error.format()
        });
        return; // ✅ return to prevent further execution
    }

    const { match_maker_id, match_receiver_id } = validation.data;

    if (match_maker_id === match_receiver_id) {
        res.status(400).json({ message: "You can't match with yourself." });
        return; // ✅ return to prevent further execution
    }

    try {
        const [existingMatch] = await sql`
            SELECT * FROM match
            WHERE match_maker_id = ${match_receiver_id}
              AND match_receiver_id = ${match_maker_id}
        `;

        if (existingMatch) {
            await sql`
                INSERT INTO match (match_maker_id, match_receiver_id, match_accepted, match_created)
                VALUES (${match_maker_id}, ${match_receiver_id}, true, now())
            `;

            await sql`
                UPDATE match
                SET match_accepted = true
                WHERE match_maker_id = ${match_receiver_id}
                  AND match_receiver_id = ${match_maker_id}
            `;

            res.status(200).json({ message: "🎉 It's a match!", matched: true });
        } else {
            await sql`
                INSERT INTO match (match_maker_id, match_receiver_id, match_accepted, match_created)
                VALUES (${match_maker_id}, ${match_receiver_id}, false, now())
            `;

            res.status(200).json({ message: "Like sent.", matched: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to process match.' });
    }
}
