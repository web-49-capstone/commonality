import type { Route } from "./+types/home";
import {LoginSignup} from "~/routes/login-signup";
import {CreateProfile} from "~/routes/create-profile";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return(
      <>
          <CreateProfile />
      </>
  )

}
