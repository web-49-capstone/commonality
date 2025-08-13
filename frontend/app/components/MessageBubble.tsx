import type {Message} from "~/utils/models/message.model";
import type {User} from "~/utils/types/user";



type Props = {message: Message, userId: string}

/**
 * MessageBubble component displays a single chat message bubble.
 * Styles the bubble based on whether the message is sent by the current user.
 * Shows message body and sent time.
 *
 * @param message Message object to display
 * @param userId Current user's ID
 */
export function MessageBubble  (props: Props)  {
    const {message, userId} = props;
    // Determine if the message is sent by the current user
    const isOwn = message.messageSenderId === userId;
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`relative max-w-xs lg:max-w-md px-5 py-3 my-3 rounded-3xl shadow-md transition-all duration-200
                ${isOwn
                    ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-xl'
                    : 'bg-white text-gray-900 rounded-bl-xl border border-gray-200'}
            `}>
                {/* Message text */}
                <p className="text-base leading-relaxed break-words">{message.messageBody}</p>
                {/* Message sent time */}
                <span className={`absolute whitespace-nowrap -bottom-5 right-2 text-xs ${isOwn ? 'text-blue-400' : 'text-gray-400 left-2'}`}
                    style={{fontSize: '0.75rem'}}>
                    {message.messageSentAt.toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
}
