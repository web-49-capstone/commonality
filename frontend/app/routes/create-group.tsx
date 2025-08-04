
import React, { useState } from 'react'
import type { Route } from './+types/create-group'
import {Form, redirect, useActionData, useLoaderData} from 'react-router'
import { getProfileLoaderData } from '~/utils/loaders/profile-loader'
import { createGroupAction } from '~/utils/actions/create-group-action'

export async function loader ({ request }: Route.LoaderArgs) {
  const profileData = await getProfileLoaderData(request)
  
  const requestHeaders = new Headers();
  requestHeaders.append('Content-Type', 'application/json');
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    requestHeaders.append('Cookie', cookie);
  }
  
  // Fetch interests for the group creation form
  const interestsResponse = await fetch(`${process.env.REST_API_URL}/interest`, {
    headers: requestHeaders
  })
  if (!interestsResponse.ok) {
    throw new Error(`Failed to fetch interests: ${interestsResponse.status}`)
  }
  const interestsData = await interestsResponse.json()
  
  return {
    ...profileData,
    interests: interestsData.data || []
  }
}

export async function action ({ request }: Route.ActionArgs) {
  return await createGroupAction(request)
}

export default function CreateGroup ({ loaderData }: Route.ComponentProps) {
  const { session, interests } = loaderData
  const initialUser = session.data.user
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  if (!initialUser) {
    return redirect('/login')
  }

  const actionData = useActionData()

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
        Create a New Group
      </h1>
      <h2 className="text-lg sm:text-xl text-center pb-8 text-gray-600 max-w-xl mx-auto">
        Let's get your group started with shared interests.
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Interests (required)
            </label>
            <input
              type="hidden"
              name="interests"
              value={JSON.stringify(selectedInterests)}
              required
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
            {selectedInterests.length === 0 && (
              <p className="mt-1 text-sm text-red-600">Please select at least one interest</p>
            )}
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

          <div>
            <button
              type="submit"
              disabled={selectedInterests.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </div>
      </Form>
    </>
  )
}
