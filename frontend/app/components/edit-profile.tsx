import {Form} from "react-router";
import {IconContext} from "react-icons";
import {CgProfile} from "react-icons/cg";
import {States} from "~/utils/types/states";
import {InterestSelector} from "~/components/interests";
import React, {useState} from "react";
import type {User} from "~/utils/models/user-schema";
import type {Interest} from "~/utils/types/interest";

type Props = {
    user: User;
    interests: Interest[];
    userInterests: Interest[];
    q: string | null;
    errorMessage?: string;
};
export function EditProfile (props: Props) {
    const {user, interests, userInterests, q, errorMessage} = props;
    const [formData, setFormData] = useState({
        userImgUrl: null as File | null,

    })
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.userImgUrl ?? null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        const maxFileSize = 1
        if (file && file.size > maxFileSize * 1024 * 1024) {
            alert(`File size exceeds ${maxFileSize}MB limit.`);
            return;
        }

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }
    return (
        <>
            <section className="flex flex-col gap-10 px-4 sm:px-6 md:px-8 pb-[5rem] md:pb-0">
                {/* ✅ Wrapper box around everything */}
                <div className="w-full bg-white shadow-xl rounded-3xl p-6 sm:p-10 space-y-10 transition-all">

                    <Form method="put" encType="multipart/form-data" id="updateProfile"
                          className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">

                        {/* LEFT SIDE */}
                        <div className="flex flex-col items-center gap-2 lg:gap-4 w-full lg:w-1/3">

                            <input
                                type="file"
                                accept="image/*"
                                name="userImgUrl"
                                id="userImgUrl"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="userImgUrl" className="hover:cursor-pointer flex flex-col items-center group">
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

                            <h2 className="text-lg font-semibold text-gray-800">{user.userName}</h2>

                            <label htmlFor="userState" className="w-full text-sm text-gray-700 font-medium">State</label>
                            <select
                                name="userState"
                                defaultValue={user.userState ?? ''}
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
                                defaultValue={user.userCity ?? ''}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {errorMessage && (
                                <div className="text-red-600 font-medium">{errorMessage}</div>
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
                                    defaultValue={user.userBio ?? ''}
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                                <label className="block text-gray-700 font-semibold mb-2">Availability</label>
                                <input
                                    name="userAvailability"
                                    defaultValue={user.userAvailability ?? ''}
                                    placeholder="Optional - e.g. Weekends, Evenings, Anytime"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="hover:cursor-pointer bg-gradient-to-br from-blue-500 to-blue-400 text-white hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ease-in-out"
                                >
                                    Save Profile
                                </button>

                            </div>
                        </div>
                    </Form>
                    {/*Interest Selector*/}
                    <div className="w-full">
                        <InterestSelector
                            user={user}
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