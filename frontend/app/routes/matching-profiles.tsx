import {MyInterestsDropdown} from "~/components/my-interests-dropdown";
import {ProfileMatchingSection} from "~/components/profile-matching-section";
import {Form, Link, redirect, useLoaderData} from "react-router";
// import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import {UserSchema} from "~/utils/models/user-schema";
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
    const matchingUsers = UserSchema.array().parse(sharedInterestsFetch.data || []);

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

    return {
        userInterests,
        interestId,
        matchingUsers,
        userId,
        match,
        matchDirection,
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
    const {userInterests, match, matchingUsers, userId, matchDirection} = useLoaderData<typeof loader>();
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
            setTimeout(() => setOpenModal(false), 1500);
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

    const buttonState = getButtonState();

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 lg:mt-10 container mx-auto">
                <div className="text-center order-2 lg:order-1">
                    <div className="text-center">
                        <img src="/commonality-logo.png" alt="Commonality Logo" className="w-1/4 mx-auto"/>
                        <h2 className="text-4xl my-3">Let's Get Started!</h2>
                        <p className="text-xl text-gray-900 mx-10">Pick an interest from your profile to see other
                            users with the same interest.</p>
                    </div>
                    <hr className="my-5 md:my-10 w-3/4 mx-auto"></hr>
                    <h2 className="text-3xl lg:text-2xl mt-5 lg:mt-10">Finding profiles interested in:</h2>
                    <MyInterestsDropdown userInterests={userInterests}/>
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">
                    {!matchingUsers || matchingUsers.length === 0 ? (
                        <div className="text-center pt-20">
                            <p className="text-red-900 text-xl">No new profiles for this interest.</p>
                            <p className="text-gray-600 mt-2">Try selecting another interest or check back later!</p>
                        </div>
                    ) : (
                        <>
                            <ProfileMatchingSection user={matchingUsers[0]}/>
                            {buttonState && (
                                <Form method="post" className="mt-4 space-y-2">
                                    <input type="hidden" name="receiverId" value={receiverId}/>
                                    <input type="hidden" name="makerId" value={makerId}/>
                                    <input type="hidden" name="matchDirection" value={matchDirection || ''}/>
                                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-3/4 mx-auto">
                                    <button
                                        onClick={handleConnectClick}
                                        className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl w-full py-3 px-6 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        name="actionType"
                                        value="connect"
                                        disabled={buttonState.connectDisabled}
                                    >
                                        {buttonState.connectText}
                                    </button>
                                    <button
                                        className="bg-gray-300 text-gray-900 border-1 border-gray-200 rounded-xl w-full py-3 px-6 hover:cursor-pointer"
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
                    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md z-50">
                        <div
                            className="mx-3 p-6 shadow-lg max-w-md w-full bg-blue-200 border-2 border-blue-600 rounded-3xl text-center">
                            <p className="text-xl text-gray-900 mb-2">Request to connect sent!</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
