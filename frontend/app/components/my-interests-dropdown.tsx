import React, { useState, useEffect } from 'react';
import type {Interest} from "~/utils/types/interest";
import {Form, Link, NavLink, useNavigate, useSearchParams} from "react-router";


interface InterestProp {
    userInterests: Interest[]
}
export function MyInterestsDropdown({userInterests}: InterestProp) {
    // const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedInterestId = searchParams.get("interestId") || "";

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSearchParams({ interestId: value });
    };

    // useEffect(() => {
    //     const qParam = searchParams.get("q")
    //     // if (qParam) {
    //     //     navigate(`/search?q=${qParam}`)
    //     // }
    //     }, []
    // )

    return (
        <Form>
            <div className="w-11/16 max-w-xs mx-auto">
                <label htmlFor="userDropdown" className="block mb-2 text-sm font-medium text-gray-800">
                </label>
                <select
                    name="interestId"
                    value={selectedInterestId}
                    onChange={handleChange}
                    id="userInterests"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>
                        -- Select an Interest --
                    </option>

                    {userInterests.map((interest) => (
                            <option id="selectedItem" key={interest.interestId} value={interest.interestId}>
                                {interest.interestName}
                            </option>
                    ))}
                </select>
                {/*<button type="submit" className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl mt-5 py-3 px-6 w-3/4 mx-auto lg:order-2 hover:cursor-pointer">Update Search</button>*/}
            </div>
        </Form>
    );
}