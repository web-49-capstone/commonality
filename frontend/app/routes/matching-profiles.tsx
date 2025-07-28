import {MyInterestsDropdown} from "~/components/my-interests-dropdown";
import {ProfileMatchingSection} from "~/components/profile-matching-section";
import {Link} from "react-router";
import type {Route} from "../../.react-router/types/app/+types/root";
import {getSession} from "~/utils/session.server";
import {UserInterestSchema} from "~/utils/models/user-interest.model";
import {InterestSchema} from "~/utils/models/interest.model";

export async function loader ({ request, params }: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const userId = session.data.user?.userId
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const userInterestsFetch = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId/${userId}`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    const userInterests = InterestSchema.array().parse(userInterestsFetch.data)


    const interestId = params?.interestId
    const sharedInterestsFetch = await fetch(`${process.env.REST_API_URL}/user/userInterestInterestId/${interestId}`)


    return {userInterests, interestId}
}

export default function MatchingProfiles({loaderData}: Route.ComponentProps) {
    const {userInterests} = loaderData;

    const testUser = {
        userId: "12312312312321",
        userFirstName: "Petey",
        userLastName: "Placeholder",
        userEmail: "pete@peterocks.com",
        userBio: "Hi I'm Petey. I am just a chill dude who wants to hang out, slam beers, and play croquet in the park. \n I want to meet people who also want to chill and hang out, and maybe even kick back - if we vibe, that is - on weekdays after work and sometimes on weekends. Hit me up!",
        userAvailability: "Weekdays after 5 and Saturday mornings before 12",
        userImageString: "https://i.kinja-img.com/image/upload/c_fit,q_60,w_645/13d0058ee7b50d10997c534cc1aba22c.jpg",
        userInterestPlaceholder: ["Camping", "Skating", "Just Hanging Out"],
        userCityState: "Los Angeles, CA"
    }
    return(
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 lg:mt-10 container mx-auto">
                <div className="text-center order-2 lg:order-1">
                    <div className="text-center">
                        <img src="/commonality-logo.png" alt="Commonality Logo" className="w-1/4 mx-auto"/>
                        <h2 className="text-4xl my-3">Let's Get Started!</h2>
                        <p className="text-xl text-gray-900 mx-10">Pick an interest from your profile to see other users with the same interest.</p>
                        {/*<hr className="mt-10 lg:mb-10 w-3/5 mx-auto"/>*/}
                        {/*<p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>*/}
                    </div>
                    <hr className="md:hidden my-5 md:my-10 w-3/4 mx-auto"></hr>
                    <h2 className="text-3xl lg:text-3xl mt-5 lg:mt-10">Finding profiles interested in:</h2>
                    <p className="text-xl italic text-red-500">--current matching interest--</p>
                    <hr className="hidden md:block my-5 md:my-10 w-3/4 mx-auto"></hr>
                    <p className="text-md font-bold">Want to search another interest?</p>
                    <MyInterestsDropdown userInterests={userInterests} />

                    {/*<hr className="my-10 w-3/4 mx-auto "></hr>*/}
                    {/*<p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>*/}
                    {/*<button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-3 px-6 w-3/4 mx-auto lg:order-1">Create a Group</button>*/}
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <ProfileMatchingSection user={testUser}/>
                </div>
            </div>
        </>
    )
}