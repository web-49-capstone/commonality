import React from "react";

import type {UserUpdated} from "~/utils/models/user-schema";
import type {Interest} from "~/utils/types/interest";

type Props = {
    user: UserUpdated,
    userInterests: Interest[]
}

export function ProfileMatchingSection({user, userInterests}: Props) {


    return(
        <>
            <div className="w-11/12 lg:w-3/4 mx-auto">
                <div className="w-[250px] h-[250px] mx-auto rounded-full overflow-hidden mt-5">
                    <img src={user.userImgUrl} alt="Profile Image" className="rounded-full h-full object-cover w-full"/>
                </div>
                <h2 className="text-4xl mt-3 mx-auto">{user.userName}</h2>
                <p className="text-lg mb-3 mx-auto">{user.userCity}, {user.userState}</p>
                <p className="text-lg"><strong>Interests: </strong>
                    <span className="flex flex-wrap gap-2 mb-2">
                                {userInterests.map((interest, index) => (
                                    <span key={index} className={"bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-sm"}>{interest.interestName}</span>))}</span>
                </p>
                <p className="text-lg"><strong>Availability: </strong>{user.userAvailability}</p>
                <div className="bg-gray-100 border-1 border-gray-900 rounded-2xl py-3 px-5 my-3">
                    <p className="text-lg text-gray-900 font-bold">About {user.userName}:</p>
                    <p className="text-md text-gray-900">{user.userBio}</p>
                </div>
            </div>
        </>
    )
}