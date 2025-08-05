import { getSession } from "~/utils/session.server";
import {redirect} from "react-router";
import {GroupSchema} from "~/utils/models/group.model";

export async function getGroupsByUserId(request: Request) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    if (!session.has("user")) {
        return redirect("/login")
    }
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    // Use the correct backend route: /groups/user/{userId}
    const response = await fetch(`${process.env.REST_API_URL}/groups/groupsUser/${session.data.user?.userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    const user = session.get('user')
    const authorization = session.get('authorization')
    if (!user || !authorization) {
        return redirect('/login')
    }

    console.log(response);

    const result = response.data
    console.log(result)
    const groups = GroupSchema.array().parse(result)

    return { groups, user: session.data.user };
}

export async function getGroupById(request: Request, groupId: string) {
  const session = await getSession(request.headers.get('Cookie'))
  if (!session.has('user')) {
    return redirect('/login')
  }

  const requestHeaders = new Headers()
  requestHeaders.append('Content-Type', 'application/json')
  requestHeaders.append('Authorization', session.data?.authorization || '')
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    requestHeaders.append('Cookie', cookie)
  }

  const response = await fetch(`${process.env.REST_API_URL}/groups/${groupId}`, {
    headers: requestHeaders
  })
  
  const data = await response.json()
  return data.data
}
