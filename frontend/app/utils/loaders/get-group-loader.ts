import { getSession } from '~/utils/session.server'
import { redirect } from 'react-router'

export async function getGroupLoaderData (request: Request, params: { groupId: string }) {
    const session = await getSession(
        request.headers.get('Cookie')
    )

    if (!session.has('user')) {
        return redirect('/login')
    }

    const groupId = params.groupId;
    if (!groupId) {
        throw new Error('groupId is required')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    const authorization = session.get('authorization')
    if (authorization) {
        requestHeaders.append('Authorization', authorization)
    }

    const [groupResponse, matchStatusResponse, pendingCountResponse, messagesResponse] = await Promise.all([
        fetch(`${process.env.REST_API_URL}/groups/${groupId}`, {
            headers: requestHeaders
        }),
        fetch(`${process.env.REST_API_URL}/group-matching/status/${session.get('user').userId}/${groupId}`, {
            headers: requestHeaders
        }),
        fetch(`${process.env.REST_API_URL}/group-matching/pending/count/${groupId}`, {
            headers: requestHeaders
        }),
        fetch(`${process.env.REST_API_URL}/group-messages/group/${groupId}`, {
            headers: requestHeaders
        })
    ]);

    const group = await groupResponse.json().then(res => res.data);
    const matchStatus = matchStatusResponse.ok ? await matchStatusResponse.json().then(res => res.data) : null;
    const pendingCount = pendingCountResponse.ok ? await pendingCountResponse.json().then(res => res.data) : 0;
    const messagesData = messagesResponse.ok ? await messagesResponse.json() : { data: [] };
    const messages = messagesData.data || [];
    console.log('DEBUG: Messages loaded:', messages.length, messages);

    return { session, group, matchStatus, pendingCount, messages }
}
