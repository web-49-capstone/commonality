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
        userEmail: "",
        userPassword: "",
        userPasswordConfirm: "",
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
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const payload = {
            ...formData,
            userImgUrl: previewUrl // Use base64 string for image
        }

        try {
            const response = await fetch('/apis/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            console.log(data)
            // Handle success or error response from backend
        } catch (error) {
            console.error('Error creating profile:', error)
        }
    }
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string>('');


    return (
        <div className="max-w-2xl mx-auto px-2 md:px-0 py-4 md:py-8">
            <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <CgProfile className="text-4xl md:text-6xl text-gray-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Create Your Profile</h2>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                <input
                    type="text"
                    name="userFirstName"
                    value={formData.userFirstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full p-2 rounded border"
                />
                <input
                    type="text"
                    name="userLastName"
                    value={formData.userLastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full p-2 rounded border"
                />
                <textarea
                    name="userBio"
                    value={formData.userBio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="w-full p-2 rounded border"
                />
                <input
                    type="text"
                    name="userAvailability"
                    value={formData.userAvailability}
                    onChange={handleChange}
                    placeholder="Availability (e.g. Weekends, Evenings)"
                    className="w-full p-2 rounded border"
                />
                <InterestSelector
                    selected={formData.interests}
                    onChange={interests => setFormData({ ...formData, interests })}
                />
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
                    <input
                        type="text"
                        name="userCity"
                        value={formData.userCity}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full p-2 rounded border"
                    />
                    <select
                        name="userState"
                        value={formData.userState}
                        onChange={handleChange}
                        className="w-full p-2 rounded border"
                    >
                        <option value="">State</option>
                        {States.map(state => (
                            <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                        ))}
                    </select>
                </div>
                <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 rounded border"
                />
                <input
                    type="password"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-2 rounded border"
                />
                <input
                    type="password"
                    name="userPasswordConfirm"
                    value={formData.userPasswordConfirm}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full p-2 rounded border"
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white mt-2">Create Profile</button>
            </form>
        </div>
    )
}