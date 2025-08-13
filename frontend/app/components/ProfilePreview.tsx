import React from "react";
import type { User } from "~/utils/models/user-schema";

/**
 * ProfilePreview component displays a compact preview card for a user's profile.
 * Shows profile image, name, and bio. Used for quick profile popups.
 *
 * @param user User object to preview
 */
export function ProfilePreview({ user }: { user: User }) {
    return (
        <div className="absolute z-50 top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-64 border">
            <div className="flex flex-col items-center gap-3">
                {/* Profile image */}
                <img src={user.userImgUrl} alt="Profile" className="w-1/2 h-1/2 rounded-full" />
                {/* User name */}
                <div>
                    <div className="font-semibold">{user.userName}</div>
                </div>
                {/* User bio or fallback */}
                <div className="text-sm text-gray-500">{user.userBio || "No bio available"}</div>
            </div>
        </div>
    );
}