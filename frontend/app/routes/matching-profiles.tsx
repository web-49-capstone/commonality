import {MyInterestsDropdown} from "../../src/layouts/my-interests-dropdown";

export default function MatchingProfiles() {
    const profile = {
        profileId: "12312312312321",
        profileFirstName: "Petey",
        profileLastName: "Placeholder",
        profileEmail: "pete@peterocks.com",
        profileBio: "Hi I'm Petey. I am just a chill dude who wants to hang out, slam beers, and play croquet in the park. \n I want to meet people who also want to chill and hang out, and maybe even kick back - if we vibe, that is - on weekdays after work and sometimes on weekends. Hit me up!",
        profileAvailability: "Weekdays after 5 and Saturday mornings before 12",
        profileImageString: "https://i.kinja-img.com/image/upload/c_fit,q_60,w_645/13d0058ee7b50d10997c534cc1aba22c.jpg",
        profileInterestPlaceholder: ["Relaxing", "Kicking Back", "Chilling Out"]
    }
    return(
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 lg:mt-15 container mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl lg:text-4xl mt-5 lg:mt-10">Finding profiles interested in:</h2>
                    <p className="text-xl italic text-red-500">--current matching interest--</p>
                    <hr className="my-5 w-3/4 mx-auto"></hr>
                    <p className="text-md font-bold">Want to search another interest?</p>
                    <MyInterestsDropdown />
                    <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl mt-5 py-3 px-6 w-3/4 mx-auto lg:order-2">View Profiles</button>
                    <hr className="my-10 w-3/4 mx-auto "></hr>
                    <p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-3 px-6 w-3/4 mx-auto lg:order-1">Create a Group</button>
                </div>
                <div className="lg:col-span-2">
                    <div className="w-2/3 mx-auto">
                        <img src={profile.profileImageString} alt="Profile Image" className="rounded-2xl w-full mt-5"/>
                        <h2 className="text-4xl my-3">{profile.profileFirstName} {profile.profileLastName}</h2>
                        <p className="text-xl"><strong>Shared Interests: </strong>{profile.profileInterestPlaceholder.join(", ")}</p>
                        <p className="text-xl"><strong>Availability: </strong>{profile.profileAvailability}</p>
                        <div className="bg-gray-200 rounded-2xl p-3 my-3">
                            <p className="text-lg text-gray-900 font-bold">About {profile.profileFirstName}:</p>
                            <p className="text-md text-gray-900">{profile.profileBio}</p>
                        </div>
                        <div className="flex justify-between gap-5">
                            <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl w-full py-3 px-6">Request to Connect</button>
                            <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl w-full py-3 px-6">Next Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}