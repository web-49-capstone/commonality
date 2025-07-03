import React, {useState} from "react";
import {InterestSelector} from "~/components/interests";
import {IconContext} from "react-icons";
import {States} from "~/types/states";
import { CgProfile } from "react-icons/cg";

const allInterests = [
    "Gaming",
    "Hiking",
    "Coding",
    "Music",
    "Fitness",
    "Art",
    "Photography",
    "Cooking",
    "Writing",
    "Traveling",
    "Reading",
    "Dancing",
    "Yoga",
    "Meditation",
    "Gardening",
    "Running",
    "Cycling",
    "Swimming",
    "Board Games",
    "Chess",
    "Movies",
    "Theater",
    "Podcasting",
    "DIY Projects",
    "Technology",
    "Machine Learning",
    "AI",
]
export default function CreateProfile() {
    const [formData, setFormData] = useState({
        userImgUrl: null as File | null,
        userFirstName: "",
        userLastName: "",
        userBio: "",
        userAvailability: "",
        interests: [] as string[],
        userCity: "",
        userState: "",
    })
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target
        setFormData((prev) => ({...prev, [name]: value}))
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setFormData((prev) => ({
            ...prev,
            userImgUrl: file,
        }))
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log(formData)
        localStorage.setItem("profile", JSON.stringify(formData));

    }
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string>('');


    return (
        <>
            <h1 className="text-4xl font-bold text-center py-5">Welcome to Commonality!</h1>
            <h2 className="text-3xl text-center pb-10">Lets get started by creating your profile.</h2>
            <section className="flex flex-col items-center gap-6 mx-6">
                <form onSubmit={handleSubmit} className=" w-full max-w-4xl flex flex-col lg:flex-row justify-between items-start gap-10 ">
                    <div className="flex flex-col items-center gap-4 w-full lg:w-1/3">
                    <input
                        type='file'
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload"
                    />
                        <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">
                            <IconContext.Provider value={{size: "6em"}}>
                            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile Preview" className="object-cover w-full h-full" />
                                ) : (
                                    <CgProfile />


                                )}
                            </div>
                            </IconContext.Provider>
                            <p className="text-sm text-gray-500 mt-2">Select a profile picture</p>
                        </label>
                    <input
                        type='text'
                        name="firstName"
                        value={formData.userFirstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="border-2 border-black py-2 pl-2 w-full"
                    />
                    <input
                        type='text'
                        name="lastName"
                        value={formData.userLastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="border-2 border-black py-2 pl-2 w-full"
                    />
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            >
                        <option value="">Select a state</option>
                            {States.map((state) => (
                                <option key={state.code} value={state.code}>
                                    {state.name}
                                </option>
                            ))}
                    </select>

                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-2/3">
                    <textarea
                        name="bio"
                        value={formData.userBio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="border-2 border-black px-3 py-2 w-full h-32"
                    />
                        <div className="border border-black rounded-lg p-4">
                            <label className="font-semibold">Availability</label>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-sm text-gray-600">Show availability on profile</span>
                            </div>
                            <input
                                name="availability"
                                value={formData.userAvailability}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="border border-black mt-3 px-2 py-1 w-full"
                            />
                        </div>
                        <div>
                            <div className="flex gap-2 mb-2">
                                <InterestSelector
                                    availableInterests={allInterests}
                                    selectedInterests={formData.interests}
                                    setSelectedInterests={(newInterests) =>
                                        setFormData({ ...formData, interests: newInterests })
                                    }
                                    label="Add Your Interests"
                                />
                            </div>

                            <p className="text-sm text-gray-500 mb-1">Suggested interests :</p>
                            <div className="flex flex-wrap gap-2 mb-2">

                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="bg-black text-white px-6 py-2 rounded">
                                Create Account
                            </button>
                        </div>
                    </div>
                </form>
            </section>

        </>
    )
}