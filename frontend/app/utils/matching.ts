// Fetch profiles matching the user's interests (excluding self)
export async function fetchMatchingProfiles(userId: string) {
  const res = await fetch(`/apis/users/${userId}/matches`)
  return res.json()
}

// Send a swipe (match request)
export async function swipeUser(makerId: string, receiverId: string) {
  const res = await fetch('/apis/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ makerId, receiverId })
  })
  return res.json()
}

