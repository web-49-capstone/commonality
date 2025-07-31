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

    const response = await fetch(`${process.env.REST_API_URL}/groups/${groupId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch group')
            }
            return res.json()
        })

    const group = response.data

    return { session, group }
}
