// Fetch mutual matches for a user
export async function fetchMutualMatches(userId: string) {
  const res = await fetch(`/apis/matches/${userId}/mutual`)
  return res.json()
}

// Fetch pending matches for a user
export async function fetchPendingMatches(userId: string) {
  const res = await fetch(`/apis/matches/${userId}/pending`)
  return res.json()
}

