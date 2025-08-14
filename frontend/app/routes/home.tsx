import type { Route } from "./+types/home";
import MatchingBegin from "~/routes/matching-begin";
import {redirect} from "react-router";
import {getSession} from "~/utils/session.server";


/**
 * Loader for home route.
 * Redirects to login if user is not authenticated.
 *
 * @param request Loader request object
 */
export async function loader({ request }: Route.LoaderArgs) {

    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    const authorization = session.get("authorization");

    if (!user || !authorization) {
        return redirect("/login");
    }

    return null;
}

/**
 * Meta function for home route.
 * Sets page title and description.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Commonality" },
    { name: "description", content: "Welcome to Commonality!" },
  ];
}

/**
 * Home component renders the main landing page after login.
 * Displays the MatchingBegin component.
 */
export default function Home() {
  return(
      <>
        <MatchingBegin />
      </>
  )
}