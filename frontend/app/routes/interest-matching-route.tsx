import {getSession} from "../utils/session.server";
import {redirect} from "react-router";
import type {Route} from "../+types/root";

/**
 * Action for adding a user interest (interest-matching-route).
 * Sends a POST request to the backend to add the interest for the user.
 * Returns success status and message from backend.
 *
 * @param request Action request object
 * @param params Route parameters
 */
export async function action({request, params}: Route.ActionArgs) {
    // Prepare request headers for backend API
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
    // Send POST request to backend to add user interest
    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(formData)
    })
    // Parse response and return status
    const data = await response.json();

    return {success: true, message: data.message, status: data.status};
}