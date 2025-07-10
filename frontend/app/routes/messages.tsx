import { useEffect, useState } from "react";
import { getUserConversations, getConversation, sendMessage, markMessagesAsRead } from "../utils/messages";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const { userId } = JSON.parse(user);
    getUserConversations(userId).then(res => {
      if (res.status === 200 && Array.isArray(res.data)) setConversations(res.data);
      setLoading(false);
    });
  }, []);

  const openConversation = async (otherUserId: string) => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const { userId } = JSON.parse(user);
    setActive(otherUserId);
    setLoading(true);
    const res = await getConversation(userId, otherUserId);
    if (res.status === 200 && Array.isArray(res.data)) setMessages(res.data);
    await markMessagesAsRead(otherUserId, userId); // Mark as read
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !active) return;
    setSending(true);
    const user = localStorage.getItem("user");
    if (!user) return;
    const { userId } = JSON.parse(user);
    await sendMessage(userId, active, input);
    setMessages([...messages, { message_body: input, message_sender_id: userId, message_receiver_id: active, message_sent_at: new Date().toISOString() }]);
    setInput("");
    setSending(false);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto mt-4 border rounded-xl shadow-lg min-h-[400px] w-full">
      {/* Conversation List */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-2 md:p-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        {loading ? <p>Loading...</p> : conversations.length === 0 ? <p>No conversations yet.</p> : (
          <ul>
            {conversations.map(conv => (
              <li key={conv.message_id || conv.user_id} className="mb-2">
                <button
                  className={`w-full text-left px-2 md:px-3 py-2 rounded ${active === (conv.user_id || conv.message_sender_id) ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
                  onClick={() => openConversation(conv.user_id || conv.message_sender_id)}
                  aria-label={`Open conversation with ${conv.user_name || ''}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openConversation(conv.user_id || conv.message_sender_id); }}
                >
                  <div className="flex items-center gap-2">
                    <img src={conv.user_img_url || ''} alt={conv.user_name ? `${conv.user_name}'s profile picture` : 'Profile'} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-semibold text-sm md:text-base">{conv.user_name || ''}</span>
                    {conv.message_opened === false && <span className="ml-2 text-xs text-blue-600" aria-label="Unread message">● Unread</span>}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 truncate max-w-full md:max-w-[180px]" aria-label="Message preview">
                    {conv.message_body ? conv.message_body.slice(0, 40) : ''}
                    {conv.message_body && conv.message_body.length > 40 ? '...' : ''}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Conversation View */}
      <div className="flex-1 flex flex-col p-2 md:p-4">
        {active ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 rounded p-2" aria-live="polite" aria-label="Conversation messages">
              {messages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.message_sender_id === active ? 'justify-start' : 'justify-end'}`}
                  tabIndex={0}
                  aria-label={`Message from ${msg.message_sender_id === active ? 'them' : 'you'}`}
                >
                  <div className={`px-3 py-2 rounded-lg ${msg.message_sender_id === active ? 'bg-gray-200 text-gray-900' : 'bg-blue-600 text-white'}`}>{msg.message_body}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded p-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Type a message..."
                disabled={sending}
                aria-label="Type a message"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSend} disabled={sending} aria-label="Send message">Send</button>
            </div>
          </>
        ) : <p className="text-gray-500">Select a conversation to view messages.</p>}
      </div>
    </div>
  );
}
