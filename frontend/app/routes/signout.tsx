import { redirect } from "react-router";
import { destroySession, getSession } from "~/utils/session.server";

export async function action({ request }: { request: Request }) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}