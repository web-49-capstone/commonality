import type {Profile} from "~/types/profile";
import {useState} from "react";
import {InterestSelector} from "./interests";

interface ProfilePageProps {
    profile: Profile;
    isCurrentUser: boolean;
}
export function ProfilePage({profile, isCurrentUser}: ProfilePageProps) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...profile });

    const handleSave = () => {
        localStorage.setItem("profile", JSON.stringify(formData));
        setEditMode(false);
        window.location.reload()
    }
    return (
        <>
            <div className="flex-1 flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto w-full p-6">
                {/* Left Column */}
                <div className="flex flex-col items-center gap-4 lg:w-1/3">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                        {formData.userImgUrl ? (
                            <img
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">👤</div>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold text-center">
                        {formData.userFirstName} {formData.userLastName}
                    </h2>
                    {isCurrentUser && (
                        <button
                            onClick={editMode ? handleSave : () => setEditMode(true)}
                            className="bg-black text-white px-6 py-2 rounded"
                        >
                            {editMode ? "Save Profile" : "Edit Profile"}
                        </button>
                    )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 lg:w-2/3">
                    {/* Bio */}
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">About Me</h3>
                        {editMode ? (
                            <textarea
                                value={formData.userBio}
                                onChange={(e) => setFormData({ ...formData, userBio: e.target.value })}
                                className="w-full border px-3 py-1 text-sm"
                            />
                        ) : (
                            <p className="text-sm text-gray-700">{formData.userBio}</p>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">Availability</h3>
                        {editMode ? (
                            <input
                                value={formData.userAvailability}
                                onChange={(e) => setFormData({ ...formData, userAvailability: e.target.value })}
                                className="w-full border px-3 py-1 text-sm"
                            />
                        ) : (
                            <p className="text-sm text-gray-600">
                                {formData.userAvailability || "Not provided"}
                            </p>
                        )}
                    </div>

                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-2">Interests</h3>
                        {editMode ? (
                            <InterestSelector
                                availableInterests={[
                                    "Gaming", "Hiking", "Coding", "Music", "Fitness", "Art", "Reading", "Cooking", "Travel", "Photography"
                                ]}
                                selectedInterests={formData.interests}
                                setSelectedInterests={(newInterests) =>
                                    setFormData({ ...formData, interests: newInterests })
                                }
                                label="Edit Your Interests"
                            />
                        ) : formData.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="bg-gray-300 text-sm px-3 py-1 rounded-full"
                                    >
          {interest}
        </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No interests added.</p>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}