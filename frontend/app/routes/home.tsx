import type { Route } from "./+types/home";
import {ProfilePage} from "~/components/profile-page";
import type {Profile} from "~/types/profile";

 const dylan:Profile = {
    firstName: 'dylan',
    lastName: "keck",
    bio: 'new here',
    interests: ["baseball"],
    profilePicture : null
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return(
      <>
          <ProfilePage profile={dylan} isCurrentUser={false} />
      </>
  )

}
