import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";

/**
 * Loader for fetching profile data and interests for the current user.
 * Ensures the user is authenticated, fetches interests by query, and retrieves user's interests.
 * Throws an error if interests cannot be fetched.
 *
 * @param {Request} request - The HTTP request object.
 * @returns {Promise<Object>} An object containing session, interests, query, and userInterests.
 */
export async function getProfileLoaderData(request: Request) {
    // Get session from cookies to identify the user
    const session = await getSession(
        request.headers.get("Cookie")
    )
    if (!session.has("user")) {
        // Redirect to login if user is not authenticated
        return redirect("/login")
    }
    // Parse query parameter for interest search
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    // Fetch interests matching the query
    const interests = await fetchInterestsByInterestName(q)

    // Fetch the user's interests from the REST API
    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId/${session.data.user?.userId}`)
        .then(res => {
            if (!res.ok) {
                // Throw error if interests cannot be fetched
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    // Validate and parse the user's interests
    const userInterests = InterestSchema.array().parse(response.data)
    return {session, interests, q, userInterests}
}