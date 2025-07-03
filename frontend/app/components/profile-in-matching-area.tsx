export type TestUser = {
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
    user: TestUser
}

export function ProfileMatchingSection({user}: Props) {
    return(
        <>
            <div className="w-3/4 mx-auto">
                <img src={user.userImageString} alt="Profile Image" className="rounded-2xl w-full mt-5"/>
                <h2 className="text-4xl mt-3">{user.userFirstName} {user.userLastName[0]}</h2>
                <p className="text-lg mb-3">{user.userCityState}</p>


                <p className="text-lg"><strong>Shared Interests: </strong>
                    <span className="flex flex-wrap gap-2 mb-2">
                                {user.userInterestPlaceholder.map((interest, index) => (
                                    <span key={index} className={"bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-sm"}>{interest}</span>
                                ))}
                            </span></p>


                <p className="text-lg"><strong>Availability: </strong>{user.userAvailability}</p>
                <div className="bg-gray-200 rounded-2xl p-3 my-3">
                    <p className="text-lg text-gray-900 font-bold">About {user.userFirstName}:</p>
                    <p className="text-md text-gray-900">{user.userBio}</p>
                </div>
                <div className="flex justify-between gap-5">
                    <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl w-full py-3 px-6">Request to Connect</button>
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl w-full py-3 px-6">Next Profile</button>
                </div>
            </div>
        </>
    )
}