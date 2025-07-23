import React, {useEffect, useState} from "react";
import {Form, useFetcher, useNavigation, useSubmit} from "react-router";
import type {Interest} from "~/utils/models/interest.model";
import type {User} from "~/utils/models/user-schema";

type Props = {interests: Interest[], q: string | null, user: User}
export function InterestSelector(props: Props) {
    const {interests, q, user} = props;
const fetcher = useFetcher()
    console.log(fetcher.data)
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        )

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
    })}}>
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
                <ul className="bg-white text-black border rounded max-h-40 overflow-auto mb-2">

                    {interests.map((interest) => (
                        <li
                            key={interest.interestId}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                //Create a new user interest object
                            const userInterest = {
                                userInterestInterestId: interest.interestId,
                                userInterestUserId: user.userId
                            }

                                //Perform a fetch to /apis/post-user-interests
                                fetcher.submit(userInterest, {
                                    method:"POST",
                                    action: "/apis/post-user-interests",
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

    </Form>
    {/*<Form action="destroy" method="delete">*/}
    {/*        <div className="flex flex-wrap gap-2">*/}
    {/*            {selectedInterests.map((interest) => (*/}
    {/*                <span*/}
    {/*                    key={interest}*/}
    {/*                    className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"*/}
    {/*                >*/}
    {/*        {interest}*/}
    {/*                    <button type="submit" className="ml-2 font-bold text-xs hover:text-red-300">*/}
    {/*          ✕*/}
    {/*        </button>*/}
    {/*      </span>))}*/}
    {/*        </div>*/}
    {/*</Form>*/}
        </div>
    );
}


// <Form
// }}
//       role="search" id="searchInterest" className="w-full max-w-4xl flex flex-col lg:flex-row justify-between items-start gap-10 ">
//     <div className="flex gap-2 mb-2">
//         {/*<InterestSelector*/}
//         {/*    interests={loaderData}*/}
//
//         {/*/>*/}
//     </div>
// </Form>