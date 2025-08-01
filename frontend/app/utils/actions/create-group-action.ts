import { commitSession, getSession } from '~/utils/session.server'
import { parseFormData } from '@remix-run/form-data-parser'
import { redirect } from 'react-router'

export async function createGroupAction (request: Request) {
  const session = await getSession(
    request.headers.get('Cookie')
  )

  const formData = await parseFormData(request)
  const groupInfo = Object.fromEntries(formData)

  const newGroup = {
    ...groupInfo,
    groupAdminUserId: session.data.user?.userId
  }

  const requestHeaders = new Headers()
  requestHeaders.append('Content-Type', 'application/json')
  requestHeaders.append('Authorization', session.data?.authorization || '')
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    requestHeaders.append('Cookie', cookie)
  }

  const response = await fetch(`${process.env.REST_API_URL}/groups`,
    {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(newGroup)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('failed to fetch interests')
        }
        return res.json()
      })

  // let data;
  // const contentType = response.headers.get('content-type') || '';
  // if (response.ok && contentType.includes('application/json')) {
  //   data = await response.json();
  // } else {
  //   // Try to get error message from text, fallback to generic
  //   const errorText = await response.text();
  //   return { success: false, error: errorText || 'Unexpected server error', status: response.status };
  // }

  if (response.status === 200) {
    const responseHeaders = new Headers()
    responseHeaders.append('Set-Cookie', await commitSession(session))
    console.log("this",response)
    return redirect(`/groupsInterest/${response.data.group.groupId}`, { headers: responseHeaders })
  }

  return { success: false, error: response.message, status: response.status }
}
