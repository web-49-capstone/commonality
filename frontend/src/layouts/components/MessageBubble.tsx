interface MessageProps {
    message: {
        messageId: number,
        messageBody: string,
        messageSenderId: string,
        messageReceiverId: string,
        messageSentAt: string
    };
    loggedInUser: {
        userId: string,
        userName: string
    }
}


const MessageBubble = ({ message, loggedInUser }: MessageProps) => {
    return (
        <div className={`flex ${message.messageSenderId === loggedInUser.userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.messageSenderId === loggedInUser.userId
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }`}>
                <p className="text-xl">{message.messageBody}</p>
                <p className={`text-md mt-1 ${
                    message.messageSenderId === loggedInUser.userId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                    {message.messageSentAt}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
