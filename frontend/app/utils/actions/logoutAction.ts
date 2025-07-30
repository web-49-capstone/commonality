import { redirect } from "react-router";
import {destroySession, getSession } from "../session.server";

export async function action(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}