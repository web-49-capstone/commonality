import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {ProfilePage} from "~/components/profile-page";

export default function UserProfilePage() {
    const { userId } = useParams();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        //  Replace this with our backend data once set up
        const mock = localStorage.getItem("mockUsers");
        const all = mock ? JSON.parse(mock) : [];
        const found = all.find((user: any) => user.id === userId);

        setProfile(found || null);
    }, [userId]);

    if (!profile) return <p className="text-center mt-10">User not found.</p>;

    return <ProfilePage profile={profile} isCurrentUser={false} />;
}
