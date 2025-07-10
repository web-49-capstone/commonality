import { useEffect, useState } from "react";
import { ProfilePage } from "~/components/profile-page";
import type { Profile } from "~/types/profile";
import { fetchUserProfile, updateUserProfile } from "../utils/profile";

export function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    const { userId } = JSON.parse(user);
    fetchUserProfile(userId)
      .then((res) => {
        if (res.status === 200 && res.data) {
          setProfile(res.data);
        } else {
          setError(res.message || "Failed to load profile");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <ProfilePage
      profile={profile}
      isCurrentUser={true}
      onSave={async (updated) => {
        const user = localStorage.getItem("user");
        if (!user) return;
        const { userId } = JSON.parse(user);
        const res = await updateUserProfile(userId, updated);
        if (res.status === 200) setProfile(updated);
        // Optionally show a success message
      }}
    />
  );
}
