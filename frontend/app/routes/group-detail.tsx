import React from 'react'
import type { Route } from './+types/group-detail'
import { redirect, useActionData, useLoaderData } from 'react-router'
import { getGroupLoaderData } from '~/utils/loaders/get-group-loader'

export async function loader ({ request, params }: Route.LoaderArgs) {
  return await getGroupLoaderData(request, params)
}

export default function GroupDetail ({ loaderData }: Route.ComponentProps) {
  const { session, group } = loaderData
  const user = session.data.user

  if (!user) {
    return redirect('/login')
  }

  const isMember = Array.isArray(group.members) && group.members.some((member: any) => member.userId === user.userId)
  const isAdmin = group.groupAdminUserId === user.userId

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{group.groupName}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{group.groupDescription}</p>
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
                <ul>
                  {Array.isArray(group.members) && group.members.length > 0 ? (
                    group.members.map((member: any) => (
                      <li key={member.userId}>{member.userName}</li>
                    ))
                  ) : (
                    <li>No members yet</li>
                  )}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Interests</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>
                  {Array.isArray(group.interests) && group.interests.length > 0 ? (
                    group.interests.map((interest: any) => (
                      <li key={interest.interestId}>{interest.interestName}</li>
                    ))
                  ) : (
                    <li>No interests yet</li>
                  )}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        {!isMember && (
          <form method="post">
            <input type="hidden" name="groupId" value={group.groupId} />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Join Group
            </button>
          </form>
        )}
      </div>

      {isAdmin && (
        <div className="mt-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Members</h3>
          {/* Add member management UI here */}
        </div>
      )}
    </div>
  )
}
