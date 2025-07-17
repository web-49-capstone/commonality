import { useEffect, useState } from "react";
import {ProfilePage} from "~/components/profile-page";
import type {Profile} from "~/types/profile";
export default function MyProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        // Replace with our backend data later
        const stored = localStorage.getItem("profile");
        if (stored) {
            setProfile(JSON.parse(stored));
        }
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return <ProfilePage profile={profile} isCurrentUser={true} />;
}
