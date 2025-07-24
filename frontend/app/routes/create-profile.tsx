import React, {useEffect} from "react";
import {States} from "~/utils/types/states";
import {commitSession, getSession} from "~/utils/session.server";
import type {Route} from "./+types/create-profile";
import {Form, redirect, useNavigation, useSubmit} from "react-router";
import {jwtDecode} from "jwt-decode";
import {UserSchema} from "~/utils/models/user-schema";
import {InterestSelector} from "~/components/interests";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";
import Geocodio from 'geocodio-library-node';


export async function loader({request}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    if (!session.has("user")) {
        return redirect("/login")
    }
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const interests = await fetchInterestsByInterestName(q)

    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId/${session.data.user?.userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    // console.log(response)
    const userInterests = InterestSchema.array().parse(response.data)
    return {session, interests, q, userInterests}
}

export async function action({request}: Route.ActionArgs) {

    // pull the userId from the session
    const session = await getSession(
        request.headers.get("Cookie")
    )

    const formData = await request.formData()
    const userInfo = Object.fromEntries(formData)
    const geocoder = new Geocodio(`${process.env.GEOCODIO_API_KEY}`);
    const location = await geocoder.geocode(`${userInfo.userCity}, ${userInfo.userState}`, [], 1)

    const userLat = location.results[0].location.lat
    const userLng = location.results[0].location.lng

    const updatedUser = {
        ...session.data.user,
        ...userInfo,
        userLat,
        userLng
    }
    console.log("updated user info: ", updatedUser)

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    const response = await fetch(`${process.env.REST_API_URL}/users/${updatedUser.userId}`,
        {
            method: 'PUT',
            headers: requestHeaders,
            body: JSON.stringify(updatedUser),
        })
    const headers = response.headers
    const data = await response.json();
    if (data.status === 200) {
        const authorization = headers.get('authorization');
        if (!authorization) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        const parsedJwtToken = jwtDecode(authorization) as any
        const validationResult = UserSchema.safeParse(parsedJwtToken.auth);
        if (!validationResult.success) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        session.set('authorization', authorization);
        session.set('user', validationResult.data)
        const responseHeaders = new Headers()
        responseHeaders.append('Set-Cookie', await commitSession(session))
        return redirect("/", {headers: responseHeaders});
    }
    return {success: false, error: data.message, status: data.status};
}


export default function CreateProfile({loaderData}: Route.ComponentProps) {
    const {session, interests, q, userInterests} = loaderData
    const initialUser = session.data.user
    if (!initialUser) {
        return redirect("/login")
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-center py-5">Welcome to Commonality!</h1>
            <h2 className="text-3xl text-center pb-10">Lets get started by creating your profile.</h2>
            <section className="flex flex-col items-center gap-6 mx-6">
                <Form method="put" id="updateProfile"
                      className="w-full max-w-4xl flex flex-col lg:flex-row justify-between items-start gap-10 ">
                    <div className="flex flex-col items-center gap-4 w-full lg:w-1/3">
                        {/*<input*/}
                        {/*    type='file'*/}
                        {/*    accept="image/*"*/}
                        {/*    onChange={handleFileChange}*/}
                        {/*    className="hidden"*/}
                        {/*    id="profile-upload"*/}
                        {/*/>*/}
                        {/*<label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">*/}
                        {/*    <IconContext.Provider value={{size: "6em"}}>*/}
                        {/*    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">*/}
                        {/*        {previewUrl ? (*/}
                        {/*            <img src={previewUrl} alt="Profile Preview" className="object-cover w-full h-full" />*/}
                        {/*        ) : (*/}
                        {/*            <CgProfile />*/}


                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*    </IconContext.Provider>*/}
                        {/*    <p className="text-sm text-gray-500 mt-2">Select a profile picture</p>*/}
                        {/*</label>*/}
                        <h2 className="text-2xl">{initialUser.userName}</h2>
                        <label htmlFor="userState">State</label>
                        <select
                            name="userState"
                            defaultValue={initialUser.userState ?? ''}
                            required
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="">Select a state</option>
                            {States.map((state) => (
                                <option key={state.code} value={state.code}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="userCity">City</label>
                        <input type="text"
                               name="userCity"
                               placeholder="City"
                               className="border border-black px-3 w-full"
                               required
                               defaultValue={initialUser.userCity ?? ''}
                        />
                        {/*<input type="hidden" name="userLat" id="userLat" defaultValue={initialUser.userLat ?? ''}/>*/}
                        {/*<input type="hidden" name="userLng" id="userLng" defaultValue={initialUser.userLng ?? ''}/>*/}

                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-2/3">
                        <input type="textarea" name="userBio" placeholder="Tell us about yourself..."
                               className="border border-black px-3 w-full h-32" required
                               defaultValue={initialUser.userBio ?? ''}/>

                        <div className="border border-black rounded-lg p-4">
                            <label className="font-semibold">Availability</label>
                            <div className="flex items-center gap-3 mt-2">
                                {/*<span className="text-sm text-gray-600">Show availability on profile</span>*/}
                            </div>
                            <input
                                name="userAvailability"
                                defaultValue={initialUser.userAvailability ?? ''}
                                placeholder="Optional - leave blank to not display."
                                className="border border-black mt-3 px-2 py-1 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-black text-white px-6 py-2 rounded">
                            Create Account
                        </button>
                    </div>
                </Form>
                <div className="flex gap-2 mb-2">
                    <InterestSelector
                        user={initialUser}
                        interests={interests}
                        q={q}
                        userInterests={userInterests}
                    />
                </div>
            </section>

        </>
    )
}