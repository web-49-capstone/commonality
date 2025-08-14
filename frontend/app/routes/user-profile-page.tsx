
import {getSession} from "~/utils/session.server";
import {UserSchema} from "~/utils/models/user-schema";
import {InterestSchema} from "~/utils/models/interest.model";
import type {Route} from "../../.react-router/types/app/+types/root";
import type {Interest} from "~/utils/types/interest";

/**
 * Loader function for the user profile page.
 * Fetches the session, target user data, and their interests.
 * Throws a 404 error if the partnerId is missing.
 *
 * @param {Route.LoaderArgs} args - Loader arguments containing params and request.
 * @returns {Promise<any>} Data for rendering the user profile page.
 */
export async function loader({params, request}: Route.LoaderArgs) {
    // Retrieve the current session to identify the viewer
    const session = await getSession(request.headers.get("Cookie"));
    const viewerId = session.data.user?.userId ?? null;

    // Extract the partnerId from route params
    const partnerId = params.partnerId;
    if (!partnerId) {
        // If no partnerId is provided, return a 404 error
        throw new Response("User not found", {status: 404});
    }

    // Fetch the target user's data from the REST API
    const userRes = await fetch(`${process.env.REST_API_URL}/users/${partnerId}`);
    const userData = await userRes.json();
    // Validate and parse the user data using UserSchema
    const viewedUser = UserSchema.parse(userData.data);

    // Fetch the user's interests from the REST API
    const interestRes = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId/${partnerId}`);
    const interestData = await interestRes.json();
    // Validate and parse the interests using InterestSchema
    const userInterests = InterestSchema.array().parse(interestData.data);

    return {viewedUser, userInterests, viewerId};
}

export default function UserProfilePage({loaderData}: Route.ComponentProps) {
    // @ts-ignore
    const {viewedUser, userInterests, viewerId} = loaderData



    return(
        <>
            <section className="max-w-4xl mx-auto p-6">
                <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
                    <div className="flex items-center gap-4">
                        <img
                            src={viewedUser.userImgUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold">{viewedUser.userName}</h2>
                            <p className="text-gray-600">
                                {viewedUser.userCity}, {viewedUser.userState}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700">Bio</h3>
                        <p className="text-gray-800">{viewedUser.userBio || "No bio provided."}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700">Availability</h3>
                        <p className="text-gray-800">{viewedUser.userAvailability || "Not specified."}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-1">Interests</h3>
                        <ul className="flex flex-wrap gap-2">
                            {userInterests.map((interest: Interest) => (
                                <li
                                    key={interest.interestId}
                                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {interest.interestName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}
