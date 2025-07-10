import { sql } from '../../utils/database.utils.ts'
import { v4 as uuidv4 } from 'uuid'

// Create or update a match (swipe)
export async function swipeMatch(makerId: string, receiverId: string) {
  // Insert or update match (swipe)
  await sql`
    INSERT INTO match (match_maker_id, match_receiver_id, match_accepted, match_created)
    VALUES (${makerId}, ${receiverId}, false, NOW())
    ON CONFLICT (match_maker_id, match_receiver_id) DO NOTHING
  `
}

// Accept a match if both users have swiped on each other
export async function acceptMatchIfMutual(makerId: string, receiverId: string) {
  // Check if the other user has already swiped on this user
  const [reciprocal] = await sql`
    SELECT * FROM match WHERE match_maker_id = ${receiverId} AND match_receiver_id = ${makerId}
  `
  if (reciprocal) {
    // Update both records to accepted
    await sql`
      UPDATE match SET match_accepted = true WHERE (match_maker_id = ${makerId} AND match_receiver_id = ${receiverId}) OR (match_maker_id = ${receiverId} AND match_receiver_id = ${makerId})
    `
    return true
  }
  return false
}

// Get all mutual matches for a user
export async function getMutualMatches(userId: string) {
  const rows = await sql`
    SELECT u.user_id, u.user_name, u.user_img_url, u.user_bio, u.user_city, u.user_state
    FROM match m
    JOIN "user" u ON (u.user_id = m.match_maker_id OR u.user_id = m.match_receiver_id)
    WHERE m.match_accepted = true
      AND (m.match_maker_id = ${userId} OR m.match_receiver_id = ${userId})
      AND u.user_id != ${userId}
  `
  return rows
}

// Get all users who have swiped on the current user but not yet matched
export async function getPendingMatches(userId: string) {
  const rows = await sql`
    SELECT u.user_id, u.user_name, u.user_img_url, u.user_bio, u.user_city, u.user_state
    FROM match m
    JOIN "user" u ON u.user_id = m.match_maker_id
    WHERE m.match_receiver_id = ${userId} AND m.match_accepted = false
  `
  return rows
}

