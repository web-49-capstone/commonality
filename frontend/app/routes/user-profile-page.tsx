import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {ProfilePage} from "~/components/profile-page";
import { fetchUserProfile } from "../utils/profile";

export function UserProfilePage() {
    const { userId } = useParams();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (!userId) return;
        fetchUserProfile(userId).then(res => {
            if (res.status === 200 && res.data) setProfile(res.data);
            else setProfile(null);
        });
    }, [userId]);

    if (!profile) return <p className="text-center mt-10 px-2">User not found.</p>;

    return <div className="px-2 md:px-0"><ProfilePage profile={profile} isCurrentUser={false} /></div>;
}
