// Get conversation between two users
export async function getConversation(userA: string, userB: string) {
  const res = await fetch(`/apis/messages/conversation?userA=${userA}&userB=${userB}`);
  return res.json();
}

// Send a message from one user to another
export async function sendMessage(senderId: string, receiverId: string, body: string) {
  const res = await fetch('/apis/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, receiverId, body })
  });
  return res.json();
}

// Get all conversations for a user (latest message per user)
export async function getUserConversations(userId: string) {
  const res = await fetch(`/apis/messages/${userId}/conversations`);
  return res.json();
}

// Mark all messages from sender to receiver as read
export async function markMessagesAsRead(senderId: string, receiverId: string) {
  const res = await fetch('/apis/messages/read', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, receiverId })
  });
  return res.json();
}
