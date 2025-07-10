import type { Profile } from "../types/profile";
import { useState } from "react";
import { InterestSelector } from "./interests";

interface ProfilePageProps {
    profile: Profile;
    isCurrentUser: boolean;
    onSave?: (updated: Profile) => void;
}
export function ProfilePage({ profile, isCurrentUser, onSave }: ProfilePageProps) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...profile });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle interest changes from InterestSelector
    const handleInterestsChange = (interests: string[]) => {
        setFormData({ ...formData, interests });
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            if (onSave) await onSave(formData);
            setEditMode(false);
        } catch (e) {
            setError("Failed to save profile");
        }
        setSaving(false);
    };
    return (
        <>
            <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-10 max-w-5xl mx-auto w-full px-2 md:px-4 lg:px-6 py-4 md:py-6">
                {/* Left Column */}
                <div className="flex flex-col items-center gap-4 w-full lg:w-1/3">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200">
                        {formData.userImgUrl ? (
                            <img
                                src={formData.userImgUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl md:text-4xl">👤</div>
                        )}
                    </div>
                    {editMode && (
                        <input
                            type="text"
                            name="userImgUrl"
                            value={formData.userImgUrl || ""}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-full p-2 rounded border"
                        />
                    )}
                    <h2 className="text-xl font-semibold text-center">
                        {editMode ? (
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName || ""}
                                onChange={handleChange}
                                className="w-full p-2 rounded border"
                                placeholder="Full Name"
                            />
                        ) : (
                            formData.userName
                        )}
                    </h2>
                    {isCurrentUser && (
                        <button
                            onClick={editMode ? handleSave : () => setEditMode(true)}
                            className="bg-black text-white px-6 py-2 rounded"
                            disabled={saving}
                        >
                            {editMode ? (saving ? "Saving..." : "Save Profile") : "Edit Profile"}
                        </button>
                    )}
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 lg:w-2/3">
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">About Me</h3>
                        {editMode ? (
                            <textarea
                                name="userBio"
                                value={formData.userBio || ""}
                                onChange={handleChange}
                                className="w-full p-2 rounded border"
                                placeholder="Tell us about yourself"
                            />
                        ) : (
                            <p>{formData.userBio}</p>
                        )}
                    </div>
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">Location</h3>
                        {editMode ? (
                            <>
                                <input
                                    type="text"
                                    name="userCity"
                                    value={formData.userCity || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded border mb-2"
                                    placeholder="City"
                                />
                                <input
                                    type="text"
                                    name="userState"
                                    value={formData.userState || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded border"
                                    placeholder="State (e.g. NY)"
                                />
                            </>
                        ) : (
                            <p>{formData.userCity}, {formData.userState}</p>
                        )}
                    </div>
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">Availability</h3>
                        {editMode ? (
                            <input
                                type="text"
                                name="userAvailability"
                                value={formData.userAvailability || ""}
                                onChange={handleChange}
                                className="w-full p-2 rounded border"
                                placeholder="e.g. Weekends, Evenings"
                            />
                        ) : (
                            <p>{formData.userAvailability}</p>
                        )}
                    </div>
                    {/* Interests */}
                    <div className="border rounded-xl p-4">
                        <h3 className="font-semibold text-lg mb-1">Interests</h3>
                        {editMode ? (
                            <InterestSelector
                                selected={formData.interests || []}
                                onChange={handleInterestsChange}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {(formData.interests || []).map((interest: string) => (
                                    <span key={interest} className="bg-gray-600 text-gray-100 px-3 py-1 rounded-xl text-sm">{interest}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}