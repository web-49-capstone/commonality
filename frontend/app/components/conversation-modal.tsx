import { useEffect, useState, useRef } from "react";
import { getConversation, sendMessage } from "../utils/messages";

export function ConversationModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (!currentUser) return;
    const { userId } = JSON.parse(currentUser);
    getConversation(userId, user.user_id).then(res => {
      if (res.status === 200 && Array.isArray(res.data)) setMessages(res.data);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    const currentUser = localStorage.getItem("user");
    if (!currentUser) return;
    const { userId } = JSON.parse(currentUser);
    await sendMessage(userId, user.user_id, input);
    setMessages([...messages, { message_body: input, message_sender_id: userId, message_receiver_id: user.user_id, message_sent_at: new Date().toISOString() }]);
    setInput("");
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-3 md:p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 text-xl md:text-2xl" onClick={onClose}>✕</button>
        <h2 className="text-lg md:text-xl font-bold mb-2">Chat with {user.user_name || user.userName || "User"}</h2>
        <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50 mb-4">
          {loading ? <p>Loading messages...</p> : messages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.message_sender_id === user.user_id ? 'justify-start' : 'justify-end'}`}>
                <div className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-sm md:text-base ${msg.message_sender_id === user.user_id ? 'bg-gray-200 text-gray-900' : 'bg-blue-600 text-white'}`}>{msg.message_body}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2 text-sm md:text-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type a message..."
            disabled={sending}
          />
          <button className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded text-sm md:text-base" onClick={handleSend} disabled={sending}>Send</button>
        </div>
      </div>
    </div>
  );
}
