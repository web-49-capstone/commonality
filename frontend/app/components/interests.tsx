import React, {useEffect, useState} from "react";
import {Form, useFetcher, useNavigation, useSubmit} from "react-router";
import type {Interest} from "~/utils/models/interest.model";
import type {User} from "~/utils/models/user-schema";
import {AiOutlineClose} from "react-icons/ai";

type Props = { interests: Interest[], q: string | null, user: User, userInterests: Interest[] }

/**
 * InterestSelector component allows users to search, add, and remove interests.
 * Displays available interests, handles search, and shows selected interests as pills.
 * Shows error messages for failed interest addition.
 *
 * @param interests List of all available interests
 * @param q Search query for interests
 * @param user Current user object
 * @param userInterests List of user's selected interests
 */
export function InterestSelector(props: Props) {
    const {interests, q, user, userInterests} = props;
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
            {/* Search and add interests */}
            <Form onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                    replace: !isFirstSearch,
                    preventScrollReset: true
                })
            }}>
                <input
                    aria-label="Search contacts"
                    defaultValue={q || ""}
                    id="q"
                    name="q"
                    placeholder="Search interests to add..."
                    type="search"
                    className="w-full p-2 border rounded mb-2 text-black"
                />
                {/* List of available interests to add */}
                {interests.length ? (
                    <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">
                        {interests.map((interest) => (
                            <li
                                key={interest.interestId}
                                className="p-2 hover:cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                    // Create a new user interest object and submit to backend
                                    const userInterest = {
                                        userInterestInterestId: interest.interestId,
                                        userInterestUserId: user.userId
                                    }
                                    fetcher.submit(userInterest, {
                                        method: "POST",
                                        action: "/api/post-user-interests",
                                        encType: "application/json"
                                    })
                                }}
                            >
                                {interest.interestName}
                            </li>
                        ))} </ul>
                ) : (
                    <p className="p-2 text-gray-500">No matches found</p>
                )}
                {/* Error message for failed interest addition */}
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
            {/* Display user's selected interests as pills with remove button */}
            <Form>
                <div className="flex flex-wrap gap-2">
                    {userInterests.map((userInterest) => (
                        <span
                            key={userInterest.interestId}
                            className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                        >{userInterest.interestName}
                            <button onClick={() => {
                                deleteFetcher.submit(
                                    {userInterestInterestId: userInterest.interestId}, {
                                    method: "DELETE",
                                    action: "/api/delete-user-interests",
                                    encType: "application/json"
                                })
                            }} type="submit" className="ml-2 font-bold text-xs hover:text-red-300 hover:cursor-pointer">✕</button>
                        </span>))}
                </div>
            </Form>
        </div>
    );
}