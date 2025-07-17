import React, {useState} from "react";
import {RequestSentButton, RequestSentContent} from "~/components/request-sent-modal";
import {Link} from "react-router";

export type User = {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userBio: string;
    userAvailability: string;
    userImageString: string;
    userInterestPlaceholder: string[];
    userCityState: string;
}

type Props = {
    user: User
}

export function ProfileMatchingSection({user}: Props) {
    const [openModal, setOpenModal] = useState(false)

    const handleOpen = () => {
        setOpenModal(true)
        setTimeout(() => setOpenModal(false), 5000)
    }

    return(
        <>
            <div className="w-11/12 lg:w-3/4 mx-auto">
                <img src={user.userImageString} alt="Profile Image" className="rounded-2xl w-full mt-5"/>
                <h2 className="text-4xl mt-3">{user.userFirstName} {user.userLastName[0]}</h2>
                <p className="text-lg mb-3">{user.userCityState}</p>
                <p className="text-lg"><strong>Shared Interests: </strong>
                    <span className="flex flex-wrap gap-2 mb-2">
                                {user.userInterestPlaceholder.map((interest, index) => (
                                    <span key={index} className={"bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-sm"}>{interest}</span>))}</span>
                </p>
                <p className="text-lg"><strong>Availability: </strong>{user.userAvailability}</p>
                <div className="bg-gray-100 border-1 border-gray-900 rounded-2xl py-3 px-5 my-3">
                    <p className="text-lg text-gray-900 font-bold">About {user.userFirstName}:</p>
                    <p className="text-md text-gray-900">{user.userBio}</p>
                </div>
                <div className="flex justify-between gap-5">
                    <RequestSentButton onClick={handleOpen} />
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl w-full py-3 px-6 hover:cursor-pointer"><Link to="/connect">Next Profile</Link></button>
                </div>
                {openModal && (
                    <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 z-50">
                        <div className="mx-3 p-6 shadow-lg max-w-md w-full bg-blue-200 border-2 border-blue-600 rounded-3xl text-center">
                            <RequestSentContent user={user} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}