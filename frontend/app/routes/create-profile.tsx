import React, {useEffect, useState} from "react";
import {States} from "~/utils/types/states";
import {commitSession, getSession} from "~/utils/session.server";
import type {Route} from "./+types/create-profile";
import {Form, redirect, useActionData, useNavigation, useSubmit} from "react-router";
import {jwtDecode} from "jwt-decode";
import {UserSchema} from "~/utils/models/user-schema";
import {InterestSelector} from "~/components/interests";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";
import Geocodio from 'geocodio-library-node';
import { IconContext } from "react-icons";
import {CgProfile} from "react-icons/cg";

import {type FileUpload, parseFormData} from '@remix-run/form-data-parser'
import {uploadToCloudinary} from "~/utils/cloudinary.server";



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

    const uploadHandler = async (file: FileUpload | string | undefined | null) => {
        if (!file) return undefined;

        if (typeof file === 'string') {

            return undefined;
        }

        if (file.fieldName === 'userImgUrl') {
            try {
                const cloudinaryUrl = await uploadToCloudinary(file.stream());
                return cloudinaryUrl;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                return undefined;
            }
        }

        return undefined;
    };


    const formData = await parseFormData(request, uploadHandler)
    console.log("formData: ", formData)
    const userInfo = Object.fromEntries(formData)
    const geocoder = new Geocodio(`${process.env.GEOCODIO_API_KEY}`);
    const location = await geocoder.geocode(`${userInfo.userCity}, ${userInfo.userState}`, [], 1)

    if (!location?.results?.length || !location.results[0]?.location) {
        return {
            success: false,
            error: 'Invalid location. Please enter a valid city and state.',
            status: 400
        }
    }

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
    const actionData = useActionData()

    const [formData, setFormData] = useState({
        userImgUrl: null as File | null,

    })
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUser.userImgUrl ?? null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null


        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }


    return (
        <>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center pt-10 text-gray-900 tracking-tight">
                Welcome to Commonality!
            </h1>
            <h2 className="text-lg sm:text-xl text-center pb-8 text-gray-600 max-w-xl mx-auto">
                Let's create your profile and help others connect with you.
            </h2>

            <section className="flex flex-col items-center gap-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* ✅ Wrapper box around everything */}
                <div className="w-full bg-white shadow-xl rounded-3xl p-6 sm:p-10 space-y-10 transition-all">

                    <Form method="post" encType="multipart/form-data" id="updateProfile"
                          className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">

                        {/* LEFT SIDE */}
                        <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">

                            <input
                                type="file"
                                accept="image/*"
                                name="userImgUrl"
                                id="userImgUrl"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="userImgUrl" className="cursor-pointer flex flex-col items-center group">
                                <IconContext.Provider value={{ size: "6em" }}>
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 ease-out">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Profile Preview" className="object-cover w-full h-full" />
                                        ) : (
                                            <CgProfile className="text-indigo-400" />
                                        )}
                                    </div>
                                </IconContext.Provider>
                                <p className="text-sm text-indigo-500 mt-2 group-hover:underline">
                                    {previewUrl ? "Change photo" : "Select a profile picture"}
                                </p>
                            </label>

                            <h2 className="text-lg font-semibold text-gray-800">{initialUser.userName}</h2>

                            <label htmlFor="userState" className="w-full text-sm text-gray-700 font-medium">State</label>
                            <select
                                name="userState"
                                defaultValue={initialUser.userState ?? ''}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select a state</option>
                                {States.map((state) => (
                                    <option key={state.code} value={state.code}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="userCity" className="w-full text-sm text-gray-700 font-medium">City</label>
                            <input
                                type="text"
                                name="userCity"
                                placeholder="Enter your city"
                                required
                                defaultValue={initialUser.userCity ?? ''}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {actionData?.error && (
                                <div className="text-red-600 font-medium">{actionData.error}</div>
                            )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col gap-6 w-full lg:w-2/3">

                            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                                <textarea
                                    name="userBio"
                                    placeholder="Tell us about yourself..."
                                    required
                                    defaultValue={initialUser.userBio ?? ''}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                                <label className="block text-gray-700 font-semibold mb-2">Availability</label>
                                <input
                                    name="userAvailability"
                                    defaultValue={initialUser.userAvailability ?? ''}
                                    placeholder="Optional - e.g. Weekends, Evenings, Anytime"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ease-in-out"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </Form>

                    {/* ✅ Interests are inside the same card box now */}
                    <div className="w-full">
                        <InterestSelector
                            user={initialUser}
                            interests={interests}
                            q={q}
                            userInterests={userInterests}
                        />
                    </div>
                </div>
            </section>


        </>
    )
}