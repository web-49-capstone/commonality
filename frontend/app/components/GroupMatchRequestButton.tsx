import React, { useState } from 'react';
import { useFetcher } from 'react-router';

interface GroupMatchRequestButtonProps {
  groupId: string;
  userId: string;
  hasPendingRequest?: boolean;
  isMatched?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GroupMatchRequestButton({
  groupId,
  userId,
  hasPendingRequest = false,
  isMatched = false,
  onSuccess,
  onError
}: GroupMatchRequestButtonProps) {
  const fetcher = useFetcher();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = async () => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('groupMatchGroupId', groupId);
    formData.append('groupMatchAccepted', 'false'); // Always false for initial request

    try {
      const response = await fetch(`${process.env.REST_API_URL}/group-matching`, {
        method: 'POST',
        body: JSON.stringify({
          groupMatchUserId: userId,
          groupMatchGroupId: groupId,
          groupMatchAccepted: false
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 200) {
        onSuccess?.();
      } else {
        onError?.(data.message || 'Failed to send group match request');
      }
    } catch (error) {
      onError?.('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMatched) {
    return (
      <div className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Connected
      </div>
    );
  }

  if (hasPendingRequest) {
    return (
      <div className="inline-flex items-center px-4 py-2 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50">
        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Request Pending
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={isSubmitting}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
        isSubmitting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      }`}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Sending...
        </>
      ) : (
        'Connect with Group'
      )}
    </button>
  );
}