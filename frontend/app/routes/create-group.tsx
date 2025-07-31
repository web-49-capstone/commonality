
import React from 'react'
import type { Route } from './+types/create-group'
import {Form, redirect, useActionData} from 'react-router'
import { getProfileLoaderData } from '~/utils/loaders/profile-loader'
import { createGroupAction } from '~/utils/actions/create-group-action'

export async function loader ({ request }: Route.LoaderArgs) {
  return await getProfileLoaderData(request)
}

export async function action ({ request }: Route.ActionArgs) {
  return await createGroupAction(request)
}

export default function CreateGroup ({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData
  const initialUser = session.data.user

  if (!initialUser) {
    return redirect('/login')
  }

  const actionData = useActionData()

  return (
    <>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center pt-10 text-gray-900 tracking-tight">
        Create a New Group
      </h1>
      <h2 className="text-lg sm:text-xl text-center pb-8 text-gray-600 max-w-xl mx-auto">
        Let's get your group started.
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
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

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Group
            </button>
          </div>
        </div>
      </Form>
    </>
  )
}
