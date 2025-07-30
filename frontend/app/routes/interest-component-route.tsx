import {getSession} from "../utils/session.server";
import {redirect} from "react-router";
import type {Route} from "../+types/root";

export async function action({ request}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const formData = await request.json()
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(formData)
    })

    const data = await response.json();

    return {success: true, message: data.message, status: data.status};
}