import React, {useEffect, useState} from "react";
import {Form, useFetcher, useNavigation, useSubmit} from "react-router";
import type {Interest} from "~/utils/models/interest.model";
import type {User} from "~/utils/models/user-schema";
import {AiOutlineClose} from "react-icons/ai";
import type {Route} from "../+types/root";
import {getSession} from "~/utils/session.server";
import {redirect} from "react-router";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";

export async function loader({ request, params }: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    if (!session.data.user) {
        return redirect("/login")
    }
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const interests = await fetchInterestsByInterestName(q)
    const groupId = params.groupId;

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');
    requestHeaders.append('Authorization', session.data?.authorization || '');
    const cookie = request.headers.get('Cookie');
    if (cookie) {
        requestHeaders.append('Cookie', cookie);
    }

    let groupInterests = [];
    
    if (groupId) {
        const response = await fetch(`${process.env.REST_API_URL}/group-interest/${groupId}`, {
            headers: requestHeaders
        })
        const data = await response.json()
        groupInterests = InterestSchema.array().parse(data.data || [])
    }
    return {session, interests, q, groupInterests, groupId}
}
export async function action({ request}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )

    const formData = await request.formData();

    const interestData = {
        groupInterestGroupId: formData.get("groupInterestGroupId"),
        groupInterestInterestId: formData.get("groupInterestInterestId"),
    };
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const response = await fetch(`${process.env.REST_API_URL}/group-interest`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(interestData)
    })

    const data = await response.json();

    return {success: true, message: data.message, status: data.status};
}
// type Props = { interests: Interest[], q: string | null, user: User, userInterests: Interest[] }

export default function InterestSelector({loaderData}: Route.ComponentProps) {
    const {interests, q, session, groupInterests, groupId} = loaderData;
    const fetcher = useFetcher()
    const deleteFetcher = useFetcher()
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        )

    const [hideMessage, setHideMessage] = useState(true);

    useEffect(() => {
        if (fetcher.data?.status === 400) {
            setHideMessage(false);
        }
    }, [fetcher.data]);


    useEffect(() => {
        const searchInterest = document.getElementById("q");
        if (searchInterest instanceof HTMLInputElement) {
            searchInterest.value = q || "";
        }
    }, [q])

    return (
        <div className="w-full">
            <Form onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                    replace: !isFirstSearch,
                })
            }}>
                <input
                    aria-label="Search contacts"
                    defaultValue={q || ""}
                    id="q"
                    name="q"
                    placeholder="Search interests..."
                    type="search"
                    className="w-full p-2 border rounded mb-2 text-black"
                />
                {interests.length ? (
                    <Form method="post">
                    <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">

                        {interests.map((interest) => (
                            <li key={interest.interestId}>
                                <button
                                    type="button"
                                    className="p-2 cursor-pointer hover:bg-gray-200 w-full text-left"
                                    onClick={() => {
                                        const formData = new FormData();
                                        formData.append("groupInterestGroupId", groupId);
                                        formData.append("groupInterestInterestId", interest.interestId);

                                        fetcher.submit(formData, {
                                            method: "POST",
                                            action: ".", // uses action from this same route
                                            encType: "application/x-www-form-urlencoded"
                                        });
                                    }}
                                >
                                    {interest.interestName}
                                </button>
                            </li>

                        ))} </ul>
                    </Form>

                ) : (
                    <p className="p-2 text-gray-500">No matches found</p>
                )}
                <div className="container mx-auto text-center">
                    {!hideMessage && fetcher.data?.status === 400 && (
                        <div
                            className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 shadow-md">
                            <span className="block sm:inline">{fetcher.data?.message}</span>
                            <button
                                className="hover:cursor-pointer ml-4"
                                onClick={() => setHideMessage(true)}
                                aria-label="Close"
                            >
                                <AiOutlineClose className="h-5 w-5 text-red-700"/>
                            </button>
                        </div>
                    )}
                </div>
            </Form>
            {/* Adding pills for already selected interests*/}

            <Form>
                <div className="flex flex-wrap gap-2">
                    {groupInterests.map((groupInterest) => (
                        <span
                            key={groupInterest.interestId}
                            className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                        >{groupInterest.interestName}
                            <button onClick={() => {
                                deleteFetcher.submit(
                                    {groupInterestInterestId: groupInterest.interestId}, {
                                        method: "DELETE",
                                        action: "/delete-user-interests",
                                        encType: "application/json"
                                    })
                            }} type="submit" className="ml-2 font-bold text-xs hover:text-red-300 hover:cursor-pointer">✕</button>
                            </span>))}
                </div>
            </Form>
        </div>
    );
}