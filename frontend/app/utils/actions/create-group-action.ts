import { commitSession, getSession } from '~/utils/session.server'
import { redirect } from 'react-router'

export async function createGroupAction (request: Request) {
  const session = await getSession(
    request.headers.get('Cookie')
  )

  const formData = await request.formData()
  const groupInfo = Object.fromEntries(formData)

  console.log("Raw form data interests:", groupInfo.interests)
  const interests = JSON.parse(groupInfo.interests || '[]')
  console.log("Parsed interests:", interests)

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
  
  console.log("Step 1: Creating group:", groupData)
  const groupResponse = await fetch(`${process.env.REST_API_URL}/groups`,
    {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(groupData)
    })
      .then(res => {
        console.log("Group creation status:", res.status)
        return res.json()
      })

  console.log("Group creation response:", groupResponse)
  
  if (groupResponse.status !== 200) {
    return { success: false, error: groupResponse.message || 'Failed to create group', status: groupResponse.status }
  }
  
  const groupId = groupResponse.data.group.groupId
  console.log("Step 2: Adding interests to group:", groupId, interests)
  
  // Step 2: Add interests to the created group
  for (const interestId of interests) {
    try {
      console.log(`Adding interest ${interestId} to group ${groupId}`)
      const interestResponse = await fetch(`${process.env.REST_API_URL}/apis/group-interest`,
        {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ groupId, interestId })
        })
      
      const interestResult = await interestResponse.json()
      console.log(`Interest ${interestId} response:`, interestResult)
    } catch (error) {
      console.error(`Failed to add interest ${interestId}:`, error)
    }
  }

  const responseHeaders = new Headers()
  responseHeaders.append('Set-Cookie', await commitSession(session))
  return redirect(`/groups/${groupId}`, { headers: responseHeaders })
}
