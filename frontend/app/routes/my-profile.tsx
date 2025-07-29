import type {Route} from "../../.react-router/types/app/routes/+types/create-profile";
import {getProfileLoaderData} from "~/utils/loaders/profile-loader";
import {editProfileAction} from "~/utils/actions/edit-profile-action";
import {redirect, useActionData} from "react-router";
import {EditProfile} from "~/components/edit-profile";
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
    if (!initialUser) {
        return redirect("/login")
    }
    const actionData = useActionData()

    return (
        <>
            <EditProfile user={initialUser} interests={interests} errorMessage={actionData?.error} q={q} userInterests={userInterests}/>
        </>
    )
}