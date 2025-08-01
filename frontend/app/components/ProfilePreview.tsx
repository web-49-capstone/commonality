import React from "react";
import type { User } from "~/utils/models/user-schema";

export function ProfilePreview({ user }: { user: User }) {
    return (
        <div className="absolute z-50 top-10 right-0 bg-white shadow-lg rounded-lg p-4 w-64 border">
            <div className="flex flex-col items-center gap-3">
                <img src={user.userImgUrl} alt="Profile" className="w-1/2 h-1/2 rounded-full" />
                <div>
                    <div className="font-semibold">{user.userName}</div>
                </div>
                    <div className="text-sm text-gray-500">{user.userBio || "No bio available"}</div>
            </div>
        </div>
    );
}