import { commitSession, getSession } from '~/utils/session.server'
import { redirect } from 'react-router'

export async function updateGroupAction (request: Request, groupId?: string) {
  const session = await getSession(
    request.headers.get('Cookie')
  )

  if (!session.data.user) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const groupInfo = Object.fromEntries(formData)

  const interests = JSON.parse(groupInfo.interests || '[]')
  
  const updatedGroup = {
    groupId: groupId,
    groupName: groupInfo.groupName,
    groupDescription: groupInfo.groupDescription,
    groupSize: parseInt(groupInfo.groupSize),
    groupAdminUserId: session.data.user.userId,
    groupUpdated: new Date()
  }

  const requestHeaders = new Headers()
  requestHeaders.append('Content-Type', 'application/json')
  requestHeaders.append('Authorization', session.data?.authorization || '')
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    requestHeaders.append('Cookie', cookie)
  }

  // Step 1: Update the group
  const response = await fetch(`${process.env.REST_API_URL}/groups`,
    {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify(updatedGroup)
    })
      .then(res => res.json())

  if (response.status !== 200) {
    return { success: false, error: response.message || 'Failed to update group', status: response.status }
  }

  // Step 2: Clear existing interests and add new ones
  if (interests.length > 0) {
    // Get current interests to remove them
    const currentInterestsResponse = await fetch(`${process.env.REST_API_URL}/group-interest/${groupId}`, {
      headers: requestHeaders
    })
    const currentData = await currentInterestsResponse.json()
    const currentInterests = currentData.data || []

    // Remove all existing interests
    for (const interest of currentInterests) {
      await fetch(`${process.env.REST_API_URL}/group-interest`, {
        method: 'DELETE',
        headers: requestHeaders,
        body: JSON.stringify({ 
          groupInterestGroupId: groupId, 
          groupInterestInterestId: interest.interestId 
        })
      })
    }

    // Add new interests
    for (const interestId of interests) {
      await fetch(`${process.env.REST_API_URL}/group-interest`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({ 
          groupInterestGroupId: groupId, 
          groupInterestInterestId: interestId 
        })
      })
    }
  }

  const responseHeaders = new Headers()
  responseHeaders.append('Set-Cookie', await commitSession(session))
  return redirect(`/groups/${groupId}`, { headers: responseHeaders })
}