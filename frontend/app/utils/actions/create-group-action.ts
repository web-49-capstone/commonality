import { commitSession, getSession } from '~/utils/session.server'
import { redirect } from 'react-router'

export async function createGroupAction (request: Request) {
  const session = await getSession(
    request.headers.get('Cookie')
  )

  const formData = await request.formData()
  const groupInfo = Object.fromEntries(formData)

  const interests = JSON.parse(groupInfo.interests || '[]')

  const requestHeaders = new Headers()
  requestHeaders.append('Content-Type', 'application/json')
  requestHeaders.append('Authorization', session.data?.authorization || '')
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    requestHeaders.append('Cookie', cookie)
  }

  // Step 1: Create the group without interests
  const groupData = {
    groupName: groupInfo.groupName,
    groupDescription: groupInfo.groupDescription,
    groupSize: parseInt(groupInfo.groupSize),
    groupAdminUserId: session.data.user?.userId
  }
  
  const groupResponse = await fetch(`${process.env.REST_API_URL}/groups`,
    {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(groupData)
    })
      .then(res => {
        return res.json()
      })


  if (groupResponse.status !== 200) {
    return { success: false, error: groupResponse.message || 'Failed to create group', status: groupResponse.status }
  }
  
  const groupId = groupResponse.data.group.groupId

  // Step 2: Add interests to the created group
  for (const interestId of interests) {
    try {
      const interestResponse = await fetch(`${process.env.REST_API_URL}/group-interest`,
        {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ groupInterestGroupId: groupId, groupInterestInterestId: interestId })
        })
      
      const interestResult = await interestResponse.json()
    } catch (error) {
      console.error(`Failed to add interest ${interestId}:`, error)
    }
  }

  const responseHeaders = new Headers()
  responseHeaders.append('Set-Cookie', await commitSession(session))
  return redirect(`/groups/${groupId}`, { headers: responseHeaders })
}
