import React, {useEffect, useState} from "react";
import type {Route} from "./+types/create-profile";
import { redirect, useActionData, useNavigation, useSubmit} from "react-router";
import {getProfileLoaderData} from "~/utils/loaders/profile-loader";
import {EditProfile} from "~/components/edit-profile";
import {editProfileAction} from "~/utils/actions/edit-profile-action";



/**
 * Loader for create-profile route.
 * Loads user session, interests, and user interests for profile creation.
 *
 * @param request Loader request object
 */
export async function loader({request}: Route.LoaderArgs) {
    return await getProfileLoaderData(request);
}

/**
 * Action for create-profile route.
 * Handles profile update form submission and returns result.
 *
 * @param request Action request object
 */
export async function action({request}: Route.ActionArgs) {
    return await editProfileAction(request);

}

/**
 * CreateProfile component renders the profile creation page.
 * Displays welcome message and profile edit form.
 * Redirects to login if user is not authenticated.
 *
 * @param loaderData Data loaded from loader (session, interests, userInterests, etc.)
 */
export default function CreateProfile({loaderData}: Route.ComponentProps) {
    const {session, interests, q, userInterests} = loaderData
    const initialUser = session.data.user
    if (!initialUser) {
        return redirect("/login")
    }
    const actionData = useActionData()




    return (
        <>
            {/* Page title and subtitle for onboarding */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center pt-10 text-gray-900 tracking-tight">
                Welcome to Commonality!
            </h1>
            <h2 className="text-lg sm:text-xl text-center text-gray-600 max-w-xl mx-auto">
                Let's create your profile and help others connect with you.
            </h2>
            {/* Profile edit form section */}
            <div className="flex justify-center items-center">
                <EditProfile user={initialUser} interests={interests} errorMessage={actionData?.error} q={q} userInterests={userInterests}/>
            </div>
        </>
    )
}