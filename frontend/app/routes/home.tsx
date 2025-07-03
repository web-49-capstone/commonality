import type { Route } from "./+types/home";
import {ProfilePage} from "~/components/profile-page";
import type {Profile} from "~/types/profile";

 const dylan:Profile = {
    userFirstName: 'dylan',
    userLastName: "keck",
    userBio: 'new here',
    interests: ["baseball"],
    userImgUrl : null,
    userState:"New Mexico",
     userCity: "Albuquerque"
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
