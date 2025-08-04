import React from 'react'
import { FaUsers, FaMapMarkerAlt } from 'react-icons/fa'
import type { Group } from '~/utils/models/group.model'

interface GroupMatchingSectionProps {
  group: any
  onConnect: () => void
  onDecline: () => void
  isConnected?: boolean
  isPending?: boolean
}

export default function GroupMatchingSection({ 
  group, 
  onConnect, 
  onDecline, 
  isConnected = false, 
  isPending = false 
}: GroupMatchingSectionProps) {
  const sharedInterests = group.sharedInterests || []
  const memberCount = group.memberCount || 1

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <FaUsers className="w-10 h-10 text-indigo-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{group.groupName}</h3>
              <p className="text-sm text-gray-600 mt-1">Created by {group.adminName}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600">
                <FaUsers className="w-4 h-4 mr-1" />
                <span className="text-sm">{memberCount}/{group.groupSize} members</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mt-3">{group.groupDescription}</p>

          {sharedInterests.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Shared Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map((interest: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            {isConnected ? (
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                ✓ Connected
              </div>
            ) : isPending ? (
              <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                ⏳ Pending Approval
              </div>
            ) : (
              <>
                <button
                  onClick={onConnect}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Request to Join
                </button>
                <button
                  onClick={onDecline}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Next Group
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}