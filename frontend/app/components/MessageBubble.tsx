import type {Message} from "~/utils/types/message";

interface MessageProps {
message: Message
}


const MessageBubble = ({ message }: MessageProps) => {
    const userId = "jfjakjkfdsajksjfd"
    return (
        <div className={`flex ${message.messageSenderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.messageSenderId === userId
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }`}>
                <p className="text-xl">{message.messageBody}</p>
                <p className={`text-md mt-1 ${
                    message.messageSenderId === userId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                    {message.messageSentAt}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
