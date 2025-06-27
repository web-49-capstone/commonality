import React, {useState} from "react";


export function CreateProfile() {
    const [formData, setFormData] = useState({
        profilePicture: null as File | null,
        firstName: "",
        lastName: "",
        bio: "",
        availability: "",
        interests: "",
    })
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target
        setFormData((prev) => ({...prev, [name]: value}))
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setFormData((prev) => ({
            ...prev,
            profilePicture: file,
        }))
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log(formData)
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-center py-5">Welcome to Commonality!</h1>
            <h2 className="text-3xl text-center">Lets get started by creating your profile.</h2>
            <section className="flex justify-center flex-wrap gap-3 my-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <input
                        type='file'
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border-2 border-black"
                    />
                    <input
                        type='text'
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="border-2 border-black"
                    />
                    <input
                        type='text'
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="border-2 border-black"
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="border-2 border-black"
                    />
                    <div className="border-2 border-black rounded-lg flex flex-col gap-2 py-5 px-1">
                    <label>Availability</label>
                    <input
                        value={formData.availability}
                        onChange={handleChange}
                        placeholder="(Optional)"
                        className="border-2 border-black"
                    />
                    </div>
                    <input
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="Interests"
                        className="border-2 border-black"
                    />
                    <button type="submit" className="bg-black text-white">Create Profile</button>
                </form>
            </section>

        </>
    )
}