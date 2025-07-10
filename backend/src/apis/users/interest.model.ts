import { sql } from '../../utils/database.utils.ts'
import { v4 as uuidv4 } from 'uuid'

export async function getAllInterests() {
  const rows = await sql`SELECT interest_id, interest_name FROM interest`
  return rows
}

export async function getUserInterests(userId: string) {
  const rows = await sql`
    SELECT i.interest_id, i.interest_name
    FROM interest i
    JOIN user_interest ui ON i.interest_id = ui.user_interest_interest_id
    WHERE ui.user_interest_user_id = ${userId}
  `
  return rows
}

export async function updateUserInterests(userId: string, interestIds: string[]) {
  // Remove existing interests
  await sql`DELETE FROM user_interest WHERE user_interest_user_id = ${userId}`
  // Insert new interests
  if (interestIds.length > 0) {
    const values = interestIds.map(interestId => `('${interestId}', '${userId}')`).join(',')
    await sql.unsafe(`INSERT INTO user_interest (user_interest_interest_id, user_interest_user_id) VALUES ${values}`)
  }
}

