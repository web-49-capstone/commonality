export async function fetchUserProfile(userId: string) {
  const res = await fetch(`/apis/users/${userId}`)
  return res.json()
}

export async function updateUserProfile(userId: string, profile: any) {
  const res = await fetch(`/apis/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  })
  return res.json()
}

