import { getSession } from "~/utils/session.server";
import {redirect} from "react-router";

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
    if (!response.ok) {
        return { error: "Failed to fetch groups" ,  status: 500 }
    }

    const result = response.data
    console.log(result)
    // If backend returns { status, data }, extract data
    if (result && Array.isArray(result.data)) {
        return { groups: result.data };
    }
    // fallback if backend returns array directly
    if (Array.isArray(result)) {
        return { groups: result };
    }
    return { groups: [] };
}