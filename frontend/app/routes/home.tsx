import type { Route } from "./+types/home";
import MatchingBegin from "~/routes/matching-begin";
import {redirect} from "react-router";
import {getSession} from "~/utils/session.server";


export async function loader({ request }: Route.LoaderArgs) {

    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    const authorization = session.get("authorization");

    if (!user || !authorization) {
        return redirect("/login");
    }

    return null;
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
        <MatchingBegin />
      </>
  )
}