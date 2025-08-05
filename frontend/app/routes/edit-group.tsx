import React, { useState } from 'react'
import type { Route } from './+types/edit-group'
import { Form, redirect, useActionData, useLoaderData } from 'react-router'
import { getGroupById } from '~/utils/loaders/group-loader'
import { updateGroupAction } from '~/utils/actions/update-group-action'

export async function loader({ request, params }: Route.LoaderArgs) {
  const groupId = params.groupId
  if (!groupId) {
    throw new Error('Group ID is required')
  }

  const group = await getGroupById(request, groupId)
  if (!group) {
    throw new Response('Group not found', { status: 404 })
  }

  // Fetch interests for the group
  const requestHeaders = new Headers()
  requestHeaders.append('Content-Type', 'application/json')
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    requestHeaders.append('Cookie', cookie)
  }

  const interestsResponse = await fetch(`${process.env.REST_API_URL}/interest`, {
    headers: requestHeaders
  })
  const interestsData = await interestsResponse.json()

  return {
    group,
    interests: interestsData.data || []
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  return await updateGroupAction(request, params.groupId)
}

export default function EditGroup({ loaderData }: Route.ComponentProps) {
  const { group, interests } = loaderData
  const actionData = useActionData()
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    group.interests?.map(i => i.interestId) || []
  )

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  return (
    <>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center pt-10 text-gray-900 tracking-tight">
        Edit Group
      </h1>
      <h2 className="text-lg sm:text-xl text-center pb-8 text-gray-600 max-w-xl mx-auto">
        Update your group information and interests.
      </h2>

      <Form method="post" className="max-w-xl mx-auto">
        <div className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="groupName"
                id="groupName"
                defaultValue={group.groupName}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700">
              Group Description
            </label>
            <div className="mt-1">
              <textarea
                id="groupDescription"
                name="groupDescription"
                rows={3}
                defaultValue={group.groupDescription}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700">
              Group Size
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="groupSize"
                id="groupSize"
                min="2"
                max="50"
                defaultValue={group.groupSize}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Interests
            </label>
            <input
              type="hidden"
              name="interests"
              value={JSON.stringify(selectedInterests)}
            />
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {interests.map((interest: any) => (
                <label key={interest.interestId} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.interestId)}
                    onChange={() => handleInterestToggle(interest.interestId)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{interest.interestName}</span>
                </label>
              ))}
            </div>
          </div>

          {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{actionData.error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Changes
            </button>
            <a
              href={`/groups/${group.groupId}`}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-400 transition-colors"
            >
              Cancel
            </a>
          </div>
        </div>
      </Form>
    </>
  )
}