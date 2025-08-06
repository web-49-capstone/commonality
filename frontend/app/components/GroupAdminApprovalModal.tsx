import React, { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';

interface PendingMatch {
  groupMatchUserId: string;
  groupMatchGroupId: string;
  userId: string;
  userName: string;
  userBio: string;
  userImgUrl: string;
  userCity: string;
  userState: string;
  sharedInterests: string[];
  groupMatchCreated: string;
}

interface GroupAdminApprovalModalProps {
  groupId: string;
  adminUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onMatchAction: (userId: string, accepted: boolean) => void;
}

export default function GroupAdminApprovalModal({
  groupId,
  adminUserId,
  isOpen,
  onClose,
  onMatchAction
}: GroupAdminApprovalModalProps) {
  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && groupId) {
      fetchPendingMatches();
    }
  }, [isOpen, groupId]);

  const fetchPendingMatches = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REST_API_URL}/group-matching/pending/group/${groupId}`);
      const data = await response.json();
      
      if (data.status === 200) {
        setPendingMatches(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch pending matches');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, accepted: boolean) => {
    setProcessing(userId);
    
    try {
      const response = await fetch(`/apis/group-matching/${userId}/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupMatchAccepted: accepted }),
      });

      const data = await response.json();
      
      if (data.status === 200) {
        onMatchAction(userId, accepted);
        // Remove from pending list
        setPendingMatches(prev => prev.filter(match => match.userId !== userId));
        
        // If no more pending matches, close modal
        if (pendingMatches.length === 1) {
          onClose();
        }
      } else {
        setError(data.message || 'Failed to process request');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Group Match Requests
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchPendingMatches}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : pendingMatches.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-gray-500">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMatches.map((match) => (
                <div key={match.userId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={match.userImgUrl || '/default-avatar.png'}
                      alt={match.userName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{match.userName}</h4>
                      <p className="text-sm text-gray-500">
                        {match.userCity}, {match.userState}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{match.userBio}</p>
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Shared interests: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.sharedInterests.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleAction(match.userId, true)}
                      disabled={processing === match.userId}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {processing === match.userId ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Accept'
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(match.userId, false)}
                      disabled={processing === match.userId}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}