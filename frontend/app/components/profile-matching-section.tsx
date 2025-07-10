import React, {useState} from "react";
import {RequestSentButton, RequestSentContent} from "~/components/request-sent-modal";
import { swipeUser } from "../utils/matching";

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
    user: User;
    onNext: () => void;
};

export function ProfileMatchingSection({user, onNext}: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [swiping, setSwiping] = useState(false);

    const handleSwipe = async () => {
        setSwiping(true);
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
            const { userId: makerId } = JSON.parse(currentUser);
            await swipeUser(makerId, user.userId);
        }
        setOpenModal(true);
        setTimeout(() => {
            setOpenModal(false);
            onNext();
            setSwiping(false);
        }, 1500);
    }

    const handleOpen = () => {
        setOpenModal(true)
        setTimeout(() => setOpenModal(false), 5000)
    }

    return(
        <>
            <div className="w-full max-w-lg md:w-3/4 mx-auto p-2 md:p-4">
                <img src={user.userImageString} alt="Profile Image" className="rounded-2xl w-full mt-3 md:mt-5 max-h-64 object-cover" />
                <h2 className="text-2xl md:text-4xl mt-2 md:mt-3">{user.userFirstName} {user.userLastName[0]}</h2>
                <p className="text-base md:text-lg mb-2 md:mb-3">{user.userCityState}</p>
                <p className="text-base md:text-lg"><strong>Shared Interests: </strong>
                    <span className="flex flex-wrap gap-2 mb-2">
                        {user.userInterestPlaceholder.map((interest, index) => (
                            <span key={index} className={"bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-xs md:text-sm"}>{interest}</span>))}
                    </span>
                </p>
                <p className="text-base md:text-lg"><strong>Availability: </strong>{user.userAvailability}</p>
                <div className="bg-gray-100 border-1 border-gray-900 rounded-2xl py-2 md:py-3 px-3 md:px-5 my-2 md:my-3">
                    <p className="text-base md:text-lg text-gray-900 font-bold">About {user.userFirstName}:</p>
                    <p className="text-sm md:text-md text-gray-900">{user.userBio}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-5">
                    <RequestSentButton onClick={handleSwipe} />
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl w-full py-2 md:py-3 px-4 md:px-6 hover:cursor-pointer" onClick={onNext} disabled={swiping}>Next Profile</button>
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