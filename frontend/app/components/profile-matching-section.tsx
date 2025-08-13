import React from "react";

import type {UserUpdated} from "~/utils/models/user-schema";
import type {Interest} from "~/utils/types/interest";

type Props = {
    user: UserUpdated,
    userInterests: Interest[]
}

/**
 * ProfileMatchingSection component displays a user's profile and interests for matching.
 * Shows profile image, name, city, state, interests, availability, and bio.
 *
 * @param user User object to display
 * @param userInterests List of user's interests
 */
export function ProfileMatchingSection({user, userInterests}: Props) {

    return(
        <>
            <div className="w-full md:w-11/12 lg:w-3/4 mx-auto bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-xl rounded-3xl pt-1 pb-3 px-6 transition-all">
                {/* Profile image */}
                <div className="w-[12rem] h-[12rem] md:w-[14rem] md:h-[14rem] mx-auto rounded-full overflow-hidden mt-3">
                    <img src={user.userImgUrl} alt="Profile Image" className="rounded-full border-3 border-indigo-300 shadow-md h-full object-cover w-full"/>
                </div>
                {/* Name, location, interests, availability, bio */}
                <h2 className="text-3xl md:text-4xl mt-2 mx-auto">{user.userName}</h2>
                <p className="text-lg mb-3 mx-auto">{user.userCity}, {user.userState}</p>
                <p className="text-lg"><strong>Interests: </strong>
                    <span className="flex flex-wrap gap-2 mb-2">
                                {userInterests.map((interest, index) => (
                                    <span key={index} className={"bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-sm"}>{interest.interestName}</span>))}</span>
                </p>
                <p className="text-lg"><strong>Availability: </strong>{user.userAvailability}</p>
                <div className="bg-gradient-to-br from-white to-gray-50 border-1 border-gray-400 rounded-2xl py-2 px-4 my-3">
                    <p className="text-lg text-gray-900 font-bold">About {user.userName}:</p>
                    <p className="text-md text-gray-900">{user.userBio}</p>
                </div>
            </div>
        </>
    )
}