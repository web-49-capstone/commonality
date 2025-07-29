import {MyInterestsDropdown} from "~/components/my-interests-dropdown";
import {ProfileMatchingSection} from "~/components/profile-matching-section";
import {Form, Link, redirect, useParams, useSearchParams} from "react-router";
import type {Route} from "../../.react-router/types/app/+types/root";
import {UserInterestSchema} from "~/utils/models/user-interest.model";
import {InterestSchema} from "~/utils/models/interest.model";
import {UserSchema} from "~/utils/models/user-schema";
import type {User} from "~/utils/types/user";
import {jwtDecode} from "jwt-decode";
import {RequestSentContent} from "~/components/request-sent-modal";
import React, {useState} from "react";
import {commitSession, getSession} from "~/utils/session.server";


export async function loader ({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const interestId = url.searchParams.get('interestId')

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

    const sharedInterestsFetch = await fetch(`${process.env.REST_API_URL}/users/userInterestInterestId/${interestId}`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })

    const matchingUsers = UserSchema.array().parse(sharedInterestsFetch.data || [])
    console.log("this",matchingUsers)

    return {userInterests, interestId, matchingUsers, userId}
}

export async function action ({request}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )

    const formData = await request.formData()
    const matchReceiverId = Object.fromEntries(formData)
    let actionType = formData.get('actionType')
    if (actionType === "false") {
        actionType = false
    } else {
        actionType = null
    }
    if (matchReceiverId.userId === session.data.user?.userId && actionType === null) {
        actionType = true
    }

    console.log("userIds: ", formData)
    // @ts-ignore
    const matchBody = {
        matchMakerId: session.data.user?.userId,
        matchReceiverId: matchReceiverId.userId,
        matchCreated: null,
        matchAccepted: actionType,
    }
console.log(matchBody)
    const user = session.get('user')
    const authorization = session.get('authorization')
    if (!user || !authorization) {
        return redirect('/login')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    if (matchReceiverId.userId === session.data.user?.userId && actionType === true || false) {
        const response = await fetch(`${process.env.REST_API_URL}/matching/updateMatch/${matchMakerId.userId}/${matchReceiverId.userId}`, {
            method: "PUT",
            headers: requestHeaders,
            body: JSON.stringify(matchBody)

        })
        if (actionType === true) {
            const messageResponse = await fetch(`process.env.REST_API_URL}/message`, {
                method: "POST",
                headers: requestHeaders,
                body: JSON.stringify({
                    messageId: uuidv7(),
                    messageSenderId: user.userId,
                    messageReceiverId: matchReceiverId.userId,
                    messageBody: "You have a new match!",
                    messageOpened: false,
                    messageSentAt: null
                })
            })
            const data = await messageResponse.json()
            return redirect(`/chat/${matchMakerId.userId}`)
        }
    }

    const response = await fetch(`${process.env.REST_API_URL}/matching`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(matchBody)

    })

    const headers = response.headers
    const data = await response.json();
    if (data.status === 200) {
        const authorization = headers.get('authorization');
        if (!authorization) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        const parsedJwtToken = jwtDecode(authorization) as any
        const validationResult = UserSchema.safeParse(parsedJwtToken.auth);
        if (!validationResult.success) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        session.set('authorization', authorization);
        session.set('user', validationResult.data)
        const responseHeaders = new Headers()
        responseHeaders.append('Set-Cookie', await commitSession(session))
        return redirect("/", {headers: responseHeaders});
    }
    return {success: false, error: data.message, status: data.status};

}

export default function MatchingProfiles({loaderData}: Route.ComponentProps) {
    // @ts-ignore
    let {userInterests, interestId, matchingUsers, userId} = loaderData;
    // matchingUsers = matchingUsers.filter((user: User) => user.userId !== userId)

    // if (matchingUsers.length > 1) {
    //     return newMatchingUsers = matchingUsers.shift()
    // }

    const [openModal, setOpenModal] = useState(false)

    const handleOpen = () => {
        setOpenModal(true)
        setTimeout(() => setOpenModal(false), 1500)
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
                    <hr className="hidden md:block my-5 md:my-10 w-3/4 mx-auto"></hr>

                    <h2 className="text-3xl lg:text-2xl mt-5 lg:mt-10">Finding profiles interested in:</h2>

                    <MyInterestsDropdown userInterests={userInterests} />


                    {/*<hr className="my-10 w-3/4 mx-auto "></hr>*/}
                    {/*<p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>*/}
                    {/*<button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-3 px-6 w-3/4 mx-auto lg:order-1">Create a Group</button>*/}
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">

                        {matchingUsers.length === 0 ? (
                        <p className="text-red-900 text-xl text-center pt-20">NO FRIENDS, GO OUTSIDE.</p>
                        ):(
                        <ProfileMatchingSection user={matchingUsers[0]}/>

                )}
                    {matchingUsers.length === 0 ? (
                        <p></p>
                    ):(
                    <Form method="post">
                        <input type="hidden" name="userId" value={matchingUsers[0]?.userId} />
                    <button onClick={handleOpen} className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl w-full py-3 px-6 hover:cursor-pointer" name="actionType" value={null | true}>Request to Connect</button>
                    <button className="bg-gray-300 text-gray-900 border-1 border-gray-200 rounded-xl w-full py-3 px-6 hover:cursor-pointer" name="actionType" value={false}>Next Profile</button>
                    </Form>)}
                </div>
                {openModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 z-50">
                        <div className="mx-3 p-6 shadow-lg max-w-md w-full bg-blue-200 border-2 border-blue-600 rounded-3xl text-center">
                            <p className="text-xl text-gray-900 mb-2">Request to connect sent!</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}