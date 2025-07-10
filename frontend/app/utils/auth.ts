// Utility functions for authentication
export async function signIn(email: string, password: string) {
  const res = await fetch('/apis/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  })
  return res.json()
}

export async function signUp(email: string, password: string) {
  const res = await fetch('/apis/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  })
  return res.json()
}

