import React, { useState, useEffect } from 'react'
import { getSession } from '~/utils/session.server'
import { redirect, useLoaderData, Form } from 'react-router'
import type { Route } from './+types/group-admin'
import { FaUser, FaCheck, FaTimes, FaUsers } from 'react-icons/fa'

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    const user = session.data.user
    
    if (!user) return redirect("/login")

    const requestHeaders = new Headers()
    requestHeaders.append("Content-Type", "application/json")
    requestHeaders.append("Authorization", session.data?.authorization || "")
    const cookie = request.headers.get("Cookie")
    if (cookie) requestHeaders.append("Cookie", cookie)

    // Fetch groups where user is admin
    const groupsResponse = await fetch(`${process.env.REST_API_URL}/groups/groupsUser/${user.userId}`, {
        headers: requestHeaders
    })
    const groupsData = await groupsResponse.json()
    const adminGroups = groupsData.data || []

    // Fetch pending matches for all user's groups
    let allPendingMatches = []
    for (const group of adminGroups) {
        const pendingResponse = await fetch(`${process.env.REST_API_URL}/group-matching/pending/group/${group.groupId}`, {
            headers: requestHeaders
        })
        const pendingData = await pendingResponse.json()
        allPendingMatches = [...allPendingMatches, ...(pendingData.data || []).map((match: any) => ({
            ...match,
            groupName: group.groupName
        }))]
    }

    return {
        user,
        adminGroups,
        pendingMatches: allPendingMatches
    }
}

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    const user = session.data.user
    const authorization = session.data.authorization

    if (!user || !authorization) return redirect("/login")

    const formData = await request.formData()
    const userId = formData.get("userId") as string
    const groupId = formData.get("groupId") as string
    const action = formData.get("action") as string

    const requestHeaders = new Headers()
    requestHeaders.append("Content-Type", "application/json")
    requestHeaders.append("Authorization", authorization)
    const cookie = request.headers.get("Cookie")
    if (cookie) requestHeaders.append("Cookie", cookie)

    await fetch(`${process.env.REST_API_URL}/group-matching/${userId}/${groupId}`, {
        method: "PUT",
        headers: requestHeaders,
        body: JSON.stringify({ groupMatchAccepted: action === "accept" })
    })

    return redirect("/group-admin")
}

export default function GroupAdmin() {
    const { user, pendingMatches } = useLoaderData<typeof loader>()
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

    const filteredMatches = selectedGroup 
        ? pendingMatches.filter(match => match.groupId === selectedGroup)
        : pendingMatches

    const groups = Array.from(new Set(pendingMatches.map(m => m.groupId)))
        .map(groupId => {
            const match = pendingMatches.find(m => m.groupId === groupId)
            return { groupId, groupName: match?.groupName || 'Unknown Group' }
        })

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center mb-6">
                <FaUsers className="w-8 h-8 text-indigo-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Group Administration</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Membership Requests</h2>
                
                {groups.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by group:</label>
                        <select 
                            value={selectedGroup || ''} 
                            onChange={(e) => setSelectedGroup(e.target.value || null)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="">All Groups</option>
                            {groups.map(group => (
                                <option key={group.groupId} value={group.groupId}>{group.groupName}</option>
                            ))}
                        </select>
                    </div>
                )}

                {filteredMatches.length === 0 ? (
                    <div className="text-center py-8"
                        <p className="text-gray-500">No pending membership requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMatches.map((match, index) => (
                            <div key={`${match.groupId}-${match.userId}-${index}`} className="border rounded-lg p-4">
                                <div className="flex items-start space-x-4">                                    <div className="flex-shrink-0">                                        <img
                                            src={match.userImgUrl || '/commonality-logo.png'}
                                            alt={match.userName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">                                        <div className="flex justify-between items-start">                                            <div>
                                                <h3 className="text-lg font-semibold">{match.userName}</h3>
                                                <p className="text-sm text-gray-600">{match.userCity}, {match.userState}</p>
                                                <p className="text-sm text-gray-700 mt-1">{match.userBio}</p>                                            </div>
                                            <div className="text-right">                                                <p className="text-sm font-medium text-indigo-600">
                                                    Requesting to join: {match.groupName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(match.groupMatchCreated).toLocaleDateString()}</p>                                            </div>
                                        </div>
                                        
                                        {match.sharedInterests && match.sharedInterests.length > 0 && (
                                            <div className="mt-2">                                                <p className="text-sm font-medium text-gray-700">Shared interests:</p>                                                <div className="flex flex-wrap gap-1 mt-1">                                                    {match.sharedInterests.map((interest: string, idx: number) => (
                                                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{interest}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4 flex space-x-3">                                            <Form method="post">                                                <input type="hidden" name="userId" value={match.userId} />                                                <input type="hidden" name="groupId" value={match.groupId} />                                                <input type="hidden" name="action" value="accept" />                                                <button
                                                    type="submit"
                                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                >                                                    <FaCheck className="w-4 h-4 mr-2" /> Accept
                                                </button>
                                            </Form>                                            <Form method="post">                                                <input type="hidden" name="userId" value={match.userId} />                                                <input type="hidden" name="groupId" value={match.groupId} />                                                <input type="hidden" name="action" value="reject" />                                                <button
                                                    type="submit"
                                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                >                                                    <FaTimes className="w-4 h-4 mr-2" /> Decline
                                                </button>
                                            </Form>                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}
            </div>
        </div>
    )
}