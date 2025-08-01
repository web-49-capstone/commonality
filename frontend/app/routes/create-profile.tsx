import React, {useEffect, useState} from "react";
import type {Route} from "./+types/create-profile";
import { redirect, useActionData, useNavigation, useSubmit} from "react-router";
import {getProfileLoaderData} from "~/utils/loaders/profile-loader";
import {EditProfile} from "~/components/edit-profile";
import {editProfileAction} from "~/utils/actions/edit-profile-action";



export async function loader({request}: Route.LoaderArgs) {
    return await getProfileLoaderData(request);
}

export async function action({request}: Route.ActionArgs) {
return await editProfileAction(request);

}


export default function CreateProfile({loaderData}: Route.ComponentProps) {
    const {session, interests, q, userInterests} = loaderData
    const initialUser = session.data.user
    if (!initialUser) {
        return redirect("/login")
    }
    const actionData = useActionData()




    return (
        <>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center pt-10 text-gray-900 tracking-tight">
                    Welcome to Commonality!
                </h1>
                <h2 className="text-lg sm:text-xl text-center text-gray-600 max-w-xl mx-auto">
                    Let's create your profile and help others connect with you.
                </h2>
                <div className="flex justify-center items-center">
               <EditProfile user={initialUser} interests={interests} errorMessage={actionData?.error} q={q} userInterests={userInterests}/>
                </div>


        </>
    )
}