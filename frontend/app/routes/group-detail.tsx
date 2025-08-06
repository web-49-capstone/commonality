import React, { useState } from 'react'
import type { Route } from './+types/group-detail'
import { redirect, useActionData, useLoaderData, Form } from 'react-router'
import { getGroupLoaderData } from '~/utils/loaders/get-group-loader'
import { getSession } from '~/utils/session.server'
import GroupMatchRequestButton from '~/components/GroupMatchRequestButton'
import GroupAdminApprovalModal from '~/components/GroupAdminApprovalModal'
import GroupMessageThread from '~/components/GroupMessageThread'

export async function loader ({ request, params }: Route.LoaderArgs) {
  return await getGroupLoaderData(request, params)
}

export async function action ({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = session.get('user')
  
  if (!user) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === 'sendGroupMessage') {
    const groupMessageBody = formData.get('groupMessageBody')
    const groupMessageGroupId = formData.get('groupMessageGroupId')
    const groupMessageUserId = formData.get('groupMessageUserId')

    if (!groupMessageBody || typeof groupMessageBody !== 'string' || groupMessageBody.trim() === '') {
      return { error: 'Message cannot be empty' }
    }

    try {
      const requestHeaders = new Headers()
      requestHeaders.append('Content-Type', 'application/json')
      requestHeaders.append('Authorization', session.get('authorization') || '')
      const cookie = request.headers.get('Cookie')
      if (cookie) {
        requestHeaders.append('Cookie', cookie)
      }

      const response = await fetch(`${process.env.REST_API_URL}/group-messages`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          groupMessageGroupId,
          groupMessageUserId,
          groupMessageBody: groupMessageBody.trim()
        })
      })

      const data = await response.json()
      
      if (data.status !== 200) {
        return { error: data.message || 'Failed to send message' }
      }

      return { success: true, revalidate: true }
    } catch (error) {
      return { error: 'Network error occurred' }
    }
  }

  return null
}

export default function GroupDetail ({ loaderData, actionData }: Route.ComponentProps) {
  const { session, group, matchStatus, pendingCount, messages } = loaderData
  const user = session.data.user
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (!user) {
    return redirect('/login')
  }

  const members = group.members || []
  const interests = group.interests || []
  const isMember = Array.isArray(members) && members.some((member: any) => member.userId === user.userId)
  const isAdmin = group.groupAdminUserId === user.userId

  // Determine match status
  const hasPendingRequest = matchStatus?.status === 'pending'
  const isMatched = matchStatus?.status === 'accepted'

  const handleMatchSuccess = () => {
    // Refresh the page data
    setRefreshKey(prev => prev + 1)
  }

  const handleMatchError = (error: string) => {
    alert(error)
  }

  const handleMatchAction = (userId: string, accepted: boolean) => {
    // Trigger refresh after admin action
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{group.groupName}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{group.groupDescription}</p>
            </div>
            
            {!isMember && !isAdmin && (
              <div className="flex-shrink-0">
                <GroupMatchRequestButton
                  groupId={group.groupId}
                  userId={user.userId}
                  hasPendingRequest={hasPendingRequest}
                  isMatched={isMatched}
                  onSuccess={handleMatchSuccess}
                  onError={handleMatchError}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Group Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{group.groupSize}</dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Members</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="space-y-1">
                  {members.length > 0 ? (
                    members.map((member: any) => (
                      <li key={member.userId} className="flex items-center space-x-2">
                        <img
                          src={member.userImgUrl || '/default-avatar.png'}
                          alt={member.userName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{member.userName}
                          {member.userId === group.groupAdminUserId && (
                            <span className="ml-1 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No members yet</li>
                  )}
                </ul>
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Interests</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="flex flex-wrap gap-2">
                  {interests.length > 0 ? (
                    interests.map((interest: any) => (
                      <li
                        key={interest.interestId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {interest.interestName}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No interests yet</li>
                  )}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        {!isMember && isAdmin && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Group Matching</h3>
              <p className="mt-1 text-sm text-gray-500">Manage group match requests</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                View Requests ({pendingCount})
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Group Messages</h3>
            <p className="mt-1 text-sm text-gray-500">Connect with group members</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <GroupMessageThread
              groupId={group.groupId}
              currentUserId={user.userId}
              isMember={isMember || isAdmin}
              messages={messages}
              actionData={actionData}
            />
          </div>
        </div>
      </div>


      <GroupAdminApprovalModal
        groupId={group.groupId}
        adminUserId={user.userId}
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onMatchAction={handleMatchAction}
      />
    </div>
  )
}
