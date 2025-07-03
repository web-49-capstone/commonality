interface MessageProps {
    message: {
        id: number;
        text: string;
        sent: boolean;
        time: string;
    };
}


const MessageBubble = ({ message }: MessageProps) => {
    return (
        <div className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sent
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }`}>
                <p className="text-xl">{message.text}</p>
                <p className={`text-md mt-1 ${
                    message.sent ? 'text-blue-100' : 'text-gray-500'
                }`}>
                    {message.time}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
