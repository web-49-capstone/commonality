import {MyInterestsDropdown} from "~/components/my-interests-dropdown";
import {ProfileMatchingSection} from "~/components/profile-matching-section";
import {Form, Link, Outlet, redirect, useLoaderData, useLocation, useMatch, useSearchParams} from "react-router";
// import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import {UserSchema, UserUpdatedSchema} from "~/utils/models/user-schema";
import {InterestSchema} from "~/utils/models/interest.model";
import {MatchSchema} from "~/utils/models/match-schema";
import {getSession} from "~/utils/session.server";
import React, {useState} from "react";
import type {Route} from "../../.react-router/types/app/+types/root";
import {v7 as uuidv7} from "uuid"

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const interestId = url.searchParams.get("interestId");

    // if (!interestId) {
    //     return { userInterests: [], interestId: null, matchingUsers: [], userId: null, match: null, matchDirection: null };
    // }

    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.data.user?.userId;

    if (!userId) return redirect("/login");

    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", session.data?.authorization || "");
    const cookie = request.headers.get("Cookie");
    if (cookie) {
        requestHeaders.append("Cookie", cookie);
    }

    const userInterestsFetch = await fetch(
        `${process.env.REST_API_URL}/interest/userInterestUserId/${userId}`,
        {headers: requestHeaders}
    ).then(res => res.json());
    const userInterests = InterestSchema.array().parse(userInterestsFetch.data || []);

    const sharedInterestsFetch = await fetch(
        `${process.env.REST_API_URL}/users/userInterestInterestId/${interestId}`,
        {headers: requestHeaders}
    ).then(res => res.json());
    const matchingUsers = UserUpdatedSchema.array().parse(sharedInterestsFetch.data || []);

    let match = null;
    let matchDirection = null;

    if (matchingUsers.length > 0) {
        const otherUserId = matchingUsers[0].userId;

        // --- IMPORTANT CHANGE ---
        // The backend route for pending matches is `/pending/:matchMakerId`.
        // The following fetches are now aligned with that structure.
        // This assumes the endpoint returns the pending match record for the given maker.

        // 1. Check if the current user (`userId`) has already sent a request to the other user.
        const matchDirectRes = await fetch(
            `${process.env.REST_API_URL}/matching/pending/${userId}`, {headers: requestHeaders}
        );

        if (matchDirectRes.ok) {
            const result = await matchDirectRes.json();
            // We must verify the pending match is with the user on screen (`otherUserId`)
            if (result.data && result.data.matchReceiverId === otherUserId) {
                match = MatchSchema.parse(result.data);
                matchDirection = 'direct'; // You sent the request.
            }
        }

        // 2. If no direct match was found, check if the other user has sent a request to the current user.
        if (!match) {
            const matchReverseRes = await fetch(
                `${process.env.REST_API_URL}/matching/pending/${otherUserId}`, {headers: requestHeaders}
            );

            if (matchReverseRes.ok) {
                const result = await matchReverseRes.json();
                // We must verify the other user's pending match is for you (`userId`)
                if (result.data && result.data.matchReceiverId === userId) {
                    match = MatchSchema.parse(result.data);
                    matchDirection = 'reverse'; // You received the request.
                }
            }
        }
    }
    const otherUserInterestsFetch = await fetch(
        `${process.env.REST_API_URL}/interest/userInterestUserId/${matchingUsers[0]?.userId}`,
        {headers: requestHeaders}
    ).then(res => res.json());
    const otherUserInterests = InterestSchema.array().parse(otherUserInterestsFetch.data || []);

    return {
        userInterests,
        interestId,
        matchingUsers,
        userId,
        match,
        matchDirection,
        otherUserInterests,
    };
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    const authorization = session.get("authorization");
    if (!user || !authorization) return redirect("/login");

    const formData = await request.formData();
    const makerId = formData.get("makerId") as string;
    const receiverId = formData.get("receiverId") as string;
    const actionValue = formData.get("actionType");
    const matchDirection = formData.get("matchDirection");

    if (user.userId !== makerId && user.userId !== receiverId) {
        console.error("Invalid action: User is not part of this match.");
        return redirect("/");
    }

    let acceptedStatus: boolean | null;

    if (actionValue === "false") {
        acceptedStatus = false;
    } else if (actionValue === "connect") {
        if (matchDirection === 'reverse') {
            acceptedStatus = true;
        } else {
            acceptedStatus = null;
        }
    } else {
        return redirect(request.url);
    }

    const matchBody = {
        matchMakerId: makerId,
        matchReceiverId: receiverId,
        matchCreated: null,
        matchAccepted: acceptedStatus,
    };

    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", authorization);
    const cookie = request.headers.get("Cookie");
    if (cookie) requestHeaders.append("Cookie", cookie);

    const isExistingMatch = matchDirection === 'direct' || matchDirection === 'reverse';

    if (isExistingMatch) {
        await fetch(`${process.env.REST_API_URL}/matching/updateMatch/${makerId}/${receiverId}`, {
            method: "PUT",
            headers: requestHeaders,
            body: JSON.stringify(matchBody),
        });

        if (matchDirection === 'reverse' && acceptedStatus === true) {
            try {
                const messageResponse = await fetch(`${process.env.REST_API_URL}/message`, {
                    method: "POST",
                    headers: requestHeaders,
                    body: JSON.stringify({
                        messageId: uuidv7(),
                        messageSenderId: receiverId,
                        messageReceiverId: makerId,
                        messageBody: "You have a new match!",
                        messageOpened: false,
                        messageSentAt: null,
                    }),
                });


                if (!messageResponse.ok) {
                    const errorText = await messageResponse.text();
                    console.error("Failed to post message:", errorText);
                } else {
                }

            } catch (error) {
                console.error("Error during message POST fetch:", error);
            }

            return redirect(`/chat/${makerId}`);
        }
    } else {
        await fetch(`${process.env.REST_API_URL}/matching`, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(matchBody),
        });
    }

    return redirect(request.url);
}

export default function MatchingProfiles() {
    const {userInterests, match, matchingUsers, userId, matchDirection, otherUserInterests} = useLoaderData<typeof loader>();
    const [openModal, setOpenModal] = useState(false);

    let receiverId = '';
    let makerId = '';

    if (match) {
        // If a match already exists from the loader, respect the roles from the database.
        makerId = match.matchMakerId;
        receiverId = match.matchReceiverId;
    } else if (matchingUsers.length > 0 && userId) {
        // For a new match, the current user is the "maker" and the user on screen is the "receiver".
        makerId = userId;
        receiverId = matchingUsers[0].userId;
    }

    const handleConnectClick = () => {
        if (!matchDirection) {
            setOpenModal(true);
            setTimeout(() => setOpenModal(false), 1800);
        }
    };

    const getButtonState = () => {
        if (!matchingUsers || matchingUsers.length === 0) {
            return null;
        }

        const otherUser = matchingUsers[0];

        if (matchDirection === 'reverse') {
            return {
                connectText: `Accept ${otherUser.userName}'s Request`,
                connectDisabled: false,
                declineText: "Decline",
            };
        }
        if (matchDirection === 'direct') {
            return {
                connectText: "Request Sent!",
                connectDisabled: true,
                declineText: "Next Profile",
            };
        }
        return {
            connectText: `Connect with ${otherUser.userName}`,
            connectDisabled: false,
            declineText: "Next Profile",
        };
    };

    const buttonState = getButtonState()
    const location = useLocation()
    const [searchParams]= useSearchParams()
    const isRootMatching = !searchParams.has('interestId')

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 md:mt-10 container mx-auto bg-white shadow-xl rounded-3xl p-6 sm:px-5 md:space-y-10 transition-all">

                <div className="text-center order-2 md:order-1 py-3">


                    <div className={!isRootMatching ? "text-center hidden md:block" : "text-center"}>
                        <img src="/commonality-logo.png" alt="Commonality Logo" className="w-1/4 mx-auto"/>
                        <h2 className="text-4xl font-semibold my-3">Meet New People</h2>
                        <p className="text-xl text-gray-900 mx-10">Select an interest from your profile to view potential connections.</p>
                    </div>


                    <hr className="my-5 md:my-10 w-3/4 mx-auto"></hr>
                    <h2 className="text-2xl md:text-2xl font-medium mt-5 md:mt-10">Find profiles interested in:</h2>
                    <MyInterestsDropdown userInterests={userInterests}/>
                    <p className="text-sm text-gray-900 mx-10 pt-5 italic">Profiles within 40 miles are displayed. <a className="text-blue-500 hover:text-blue-700" href="/profile">Change your city and state</a> to search somewhere else.</p>

                </div>
                <div className="md:col-span-2 order-1 md:order-2">
                    {!matchingUsers || matchingUsers.length === 0 ? (
                        <div className="text-center">
                            {isRootMatching ? (
                                <div className="text-red-900 text-xl hidden pt-20 md:block">
                                    <p>Select an interest to start matching.</p>
                                </div>
                            ) : (
                                <div className="pt-20">
                                    <p className="text-red-900 text-xl">No new profiles for this interest.</p>
                                    <p className="text-gray-600 mt-2">Try selecting another interest or check back later!</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <ProfileMatchingSection user={matchingUsers[0]} userInterests={otherUserInterests}/>
                            {buttonState && (
                                <Form method="post" className="mt-4 space-y-2">
                                    <input type="hidden" name="receiverId" value={receiverId}/>
                                    <input type="hidden" name="makerId" value={makerId}/>
                                    <input type="hidden" name="matchDirection" value={matchDirection || ''}/>
                                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-3/4 mx-auto">
                                    <button
                                        onClick={handleConnectClick}
                                        className="bg-gradient-to-br from-green-500 to-green-400 hover:to-green-600 transition-colors text-white shadow-md rounded-xl w-full py-3 px-6 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        name="actionType"
                                        value="connect"
                                        disabled={buttonState.connectDisabled}
                                    >
                                        {buttonState.connectText}
                                    </button>
                                    <button
                                        className="bg-gradient-to-br from-blue-500 to-blue-400 hover:to-blue-600 transition-colors shadow-md text-white rounded-xl w-full py-3 px-6 hover:cursor-pointer"
                                        name="actionType"
                                        value="false"
                                    >
                                        {buttonState.declineText}
                                    </button>
                                    </div>
                                </Form>
                            )}
                        </>
                    )}
                </div>
                {openModal && (
                    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50">
                        <div className="mx-3 p-8 shadow-2xl max-w-md w-full bg-blue-100 border border-blue-600 rounded-3xl text-center flex flex-col items-center space-y-3">
                            <svg className="w-12 h-12 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e0f2fe"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <p className="text-xl font-semibold text-gray-900">Requested to Connect!</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
