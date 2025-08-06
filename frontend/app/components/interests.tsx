import React, {useEffect, useState} from "react";
import {Form, useFetcher, useNavigation, useSubmit} from "react-router";
import type {Interest} from "~/utils/models/interest.model";
import type {User} from "~/utils/models/user-schema";
import {AiOutlineClose} from "react-icons/ai";

type Props = { interests: Interest[], q: string | null, user: User, userInterests: Interest[] }

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
                    placeholder="Search interests to add..."
                    type="search"
                    className="w-full p-2 border rounded mb-2 text-black"
                />
                {interests.length ? (
                    <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">

                        {interests.map((interest) => (
                            <li
                                key={interest.interestId}
                                className="p-2 hover:cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                    //Create a new user interest object
                                    const userInterest = {
                                        userInterestInterestId: interest.interestId,
                                        userInterestUserId: user.userId
                                    }

                                    //Perform a fetch to /api/post-user-interests
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