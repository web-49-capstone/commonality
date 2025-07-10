import { MyInterestsDropdown } from "~/components/my-interests-dropdown";
import { ProfileMatchingSection } from "~/components/profile-matching-section";
import { useEffect, useState } from "react";
import { fetchMatchingProfiles } from "../utils/matching";
import { fetchMutualMatches, fetchPendingMatches } from "../utils/matches";
import { ConversationModal } from "~/components/conversation-modal";

export default function MatchingProfiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutualMatches, setMutualMatches] = useState<any[]>([]);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    const { userId } = JSON.parse(user);
    fetchMatchingProfiles(userId)
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          setProfiles(res.data);
        } else {
          setError(res.message || "Failed to load profiles");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setLoading(false);
      });
    // Fetch mutual and pending matches
    fetchMutualMatches(userId).then(res => {
      if (res.status === 200 && Array.isArray(res.data)) setMutualMatches(res.data);
    });
    fetchPendingMatches(userId).then(res => {
      if (res.status === 200 && Array.isArray(res.data)) setPendingMatches(res.data);
    });
  }, []);

  const handleNext = () => setCurrent((c) => c + 1);

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!profiles.length || current >= profiles.length)
    return <p>No more profiles to show.</p>;

  // Map backend user to ProfileMatchingSection user type
  const user = profiles[current];
  const mappedUser = {
    userId: user.user_id,
    userFirstName: user.userName || user.user_name || "",
    userLastName: "?",
    userEmail: user.userEmail || "",
    userBio: user.userBio || user.user_bio || "",
    userAvailability: user.userAvailability || user.user_availability || "",
    userImageString: user.userImgUrl || user.user_img_url || "",
    userInterestPlaceholder: user.interests || [],
    userCityState: `${user.userCity || user.user_city || ""}, ${user.userState || user.user_state || ""}`
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 mt-3 md:mt-5 lg:mt-10 container mx-auto gap-4 md:gap-8">
        <div className="text-center order-2 lg:order-1 px-2 md:px-0">
          <hr className="md:hidden my-3 md:my-5 md:my-10 w-3/4 mx-auto"></hr>
          <h2 className="text-2xl md:text-3xl lg:text-3xl mt-3 md:mt-5 lg:mt-10">
            Finding profiles interested in:
          </h2>
          <p className="text-base md:text-xl italic text-red-500">
            --current matching interest--
          </p>
          <hr className="hidden md:block my-3 md:my-5 md:my-10 w-3/4 mx-auto"></hr>
          <p className="text-sm md:text-md font-bold">Want to search another interest?</p>
          <MyInterestsDropdown />
          <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl mt-3 md:mt-5 py-2 md:py-3 px-4 md:px-6 w-full md:w-3/4 mx-auto lg:order-2">
            View Profiles
          </button>
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2 w-full">
          <ProfileMatchingSection user={mappedUser} onNext={handleNext} />
        </div>
      </div>
      {/* Mutual Matches Section */}
      <div className="max-w-4xl mx-auto mt-6 md:mt-10 px-2 md:px-0">
        <h3 className="text-xl md:text-2xl font-bold mb-2">Mutual Matches</h3>
        {mutualMatches.length === 0 ? (
          <p className="text-gray-500">No mutual matches yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            {mutualMatches.map((match: any) => (
              <div key={match.user_id} className="border rounded-xl p-3 md:p-4 w-full max-w-xs bg-white shadow">
                <img src={match.user_img_url || match.userImgUrl || ''} alt="Profile" className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-2 object-cover" />
                <h4 className="text-base md:text-lg font-semibold text-center">{match.user_name || match.userName || ''}</h4>
                <p className="text-center text-gray-600 text-xs md:text-sm">{match.user_city || match.userCity || ''}, {match.user_state || match.userState || ''}</p>
                <button
                  className="mt-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded w-full"
                  onClick={() => setActiveConversation(match)}
                >
                  Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Pending Matches Section */}
      <div className="max-w-4xl mx-auto mt-6 md:mt-10 px-2 md:px-0">
        <h3 className="text-xl md:text-2xl font-bold mb-2">Pending Matches</h3>
        {pendingMatches.length === 0 ? (
          <p className="text-gray-500">No pending matches.</p>
        ) : (
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            {pendingMatches.map((match: any) => (
              <div key={match.user_id} className="border rounded-xl p-3 md:p-4 w-full max-w-xs bg-white shadow">
                <img src={match.user_img_url || match.userImgUrl || ''} alt="Profile" className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-2 object-cover" />
                <h4 className="text-base md:text-lg font-semibold text-center">{match.user_name || match.userName || ''}</h4>
                <p className="text-center text-gray-600 text-xs md:text-sm">{match.user_city || match.userCity || ''}, {match.user_state || match.userState || ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Conversation Modal */}
      {activeConversation && (
        <ConversationModal
          user={activeConversation}
          onClose={() => setActiveConversation(null)}
        />
      )}
    </>
  );
}