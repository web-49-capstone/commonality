import type {Route} from "../../.react-router/types/app/routes/+types/create-profile";
import {getProfileLoaderData} from "~/utils/loaders/profile-loader";
import {editProfileAction} from "~/utils/actions/edit-profile-action";
import {redirect, useActionData, useNavigation} from "react-router";
import {EditProfile} from "~/components/edit-profile";
import { Form } from "react-router";
import React from "react";

export async function loader({request}: Route.LoaderArgs) {
    return await getProfileLoaderData(request);
}

export async function action({request}: Route.ActionArgs) {
    return await editProfileAction(request);

}



export default function MyProfile({loaderData}: Route.ComponentProps) {
    const {session, interests, q, userInterests} = loaderData
    const initialUser = session.data.user
    const [editMode, setEditMode] = React.useState(false);
    const navigation = useNavigation();

    if (!initialUser) {
        return redirect("/login")
    }
    const actionData = useActionData()
    React.useEffect(() => {
        if (navigation.state === "submitting" && editMode) {
            setEditMode(false);
        }
    }, [navigation.state]);



    return (
        <>
            <section className="max-w-4xl min-w-1/2 mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <div className="flex flex-row gap-4">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="hover:cursor-pointer bg-gradient-to-br from-blue-500 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:to-indigo-700 transition"
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                        onClick={() => setEditMode(false)}
                        className="hover:cursor-pointer bg-gradient-to-br from-red-500 to-red-400 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition align-right"
                    >
                        Cancel
                    </button>
                        )}
                    {/* Sign Out Button */}

                        <Form method="post" action="/signout">
                        <button
                            type="submit"
                            className="hover:cursor-pointer bg-gradient-to-br from-red-500 to-red-400 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                            Sign Out
                        </button>
                    </Form>

                  </div>
                </div>
                {editMode ? (
                    <div>
                    <div className="flex justify-end mb-4 mr-9">

                    </div>

                    <EditProfile
                        user={initialUser}
                        interests={interests}
                        errorMessage={actionData?.error}
                        q={q}
                        userInterests={userInterests}
                    />
</div>

                ) : (
                    <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                                <img
                                    src={initialUser.userImgUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border"
                                />
                            <div>
                                <h2 className="text-2xl font-semibold">{initialUser.userName}</h2>
                                <p className="text-gray-600">{initialUser.userCity}, {initialUser.userState}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">Bio:</h3>
                            <p className="text-gray-800">{initialUser.userBio || "No bio provided."}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700">Availability:</h3>
                            <p className="text-gray-800">{initialUser.userAvailability || "Not specified."}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-700 mb-1">Interests:</h3>
                            <ul className="flex flex-wrap gap-2">
                                {userInterests.map((interest) => (
                                    <li key={interest.interestId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        {interest.interestName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </section>

        </>
    )
}