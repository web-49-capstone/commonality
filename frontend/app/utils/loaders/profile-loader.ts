import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";

export async function getProfileLoaderData(request: Request) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    if (!session.has("user")) {
        return redirect("/login")
    }
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const interests = await fetchInterestsByInterestName(q)

    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId/${session.data.user?.userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    const userInterests = InterestSchema.array().parse(response.data)
    return {session, interests, q, userInterests}
}