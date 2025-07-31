import { getSession } from "~/utils/session.server";

export async function getGroupsByUserId(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("user")?.userId;

    if (!userId) {
        return { error: "User not logged in" , status: 401 }
    }

    // Use the correct backend route: /groups/user/{userId}
    const response = await fetch(`${process.env.REST_API_URL}/groups/user/${userId}`);

    if (!response.ok) {
        return { error: "Failed to fetch groups" ,  status: 500 }
    }

    const result = await response.json();
    // If backend returns { status, data }, extract data
    if (result && Array.isArray(result.data)) {
        return { data: result.data };
    }
    // If backend returns array directly
    if (Array.isArray(result)) {
        return { data: result };
    }
    // Fallback: return empty array
    return { data: [] };
}