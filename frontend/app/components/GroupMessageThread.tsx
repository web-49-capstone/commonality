import React, { useState, useEffect, useRef } from 'react';
import { Form, useFetcher, useRevalidator } from 'react-router';

interface GroupMessage {
  groupMessageId: string;
  groupMessageGroupId: string;
  groupMessageUserId: string;
  groupMessageBody: string;
  groupMessageSentAt: string;
  userName: string;
  userImgUrl?: string;
}

interface GroupMessageThreadProps {
  groupId: string;
  currentUserId: string;
  isMember: boolean;
  actionData?: { error?: string; success?: boolean };
}

export default function GroupMessageThread({ groupId, currentUserId, isMember, messages: initialMessages, actionData }: GroupMessageThreadProps & { messages: GroupMessage[] }) {
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const revalidator = useRevalidator();

  useEffect(() => {
    if (isMember && groupId) {
      // Set up polling for new messages
      const interval = setInterval(() => {
        if (revalidator.state === 'idle') {
          revalidator.revalidate();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [groupId, isMember, revalidator]);

  useEffect(() => {
    console.log('DEBUG: Initial messages received:', initialMessages?.length, initialMessages);
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    if (actionData?.success) {
      setNewMessage('');
      setError('');
      console.log('DEBUG: Message sent, revalidating...');
      revalidator.revalidate(); // Refresh messages from server
    }
    if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData, revalidator]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [date: string]: GroupMessage[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.groupMessageSentAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return grouped;
  };

  if (!isMember) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-2 text-gray-500">Join this group to start messaging</p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="mt-2 text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                    {date}
                  </div>
                </div>
                
                {dateMessages.map((message) => (
                  <div
                    key={message.groupMessageId}
                    className={`flex ${message.groupMessageUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-xs ${message.groupMessageUserId === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.groupMessageUserId !== currentUserId && (
                        <img
                          src={message.userImgUrl || '/default-avatar.png'}
                          alt={message.userName}
                          className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                        />
                      )}
                      <div className={`flex flex-col ${message.groupMessageUserId === currentUserId ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.groupMessageUserId === currentUserId
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.groupMessageBody}</p>
                        </div>
                        <div className={`mt-1 text-xs ${
                          message.groupMessageUserId === currentUserId ? 'text-right' : 'text-left'
                        } text-gray-500`}>
                          {message.userName} • {formatTime(message.groupMessageSentAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Form method="post" className="border-t border-gray-200 p-4">
        <input type="hidden" name="intent" value="sendGroupMessage" />
        <input type="hidden" name="groupMessageGroupId" value={groupId} />
        <input type="hidden" name="groupMessageUserId" value={currentUserId} />
        
        <div className="flex space-x-2">
          <input
            type="text"
            name="groupMessageBody"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        {(error || actionData?.error) && <p className="mt-2 text-sm text-red-600">{error || actionData?.error}</p>}
      </Form>
    </div>
  );
}