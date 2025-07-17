interface ContactProps {
    contact: {
        userId: string;
        userName: string;
        lastMessage: string;
        messageTime: string;
        userImgUrl: string;
        isOnline: boolean;
        unreadMessages: number;
        selectedChat: number;
    },
    setSelectedChat: (index: number) => void;
    selectedChat: number;
    index: number;
}

const ChatTabs = ({contact, setSelectedChat, selectedChat, index} : ContactProps) =>

{
    return (
        <div className="flex-1 overflow-y-auto">
                <div
                    onClick={() => setSelectedChat(index)}
                    className={`flex items-center p-3  hover:bg-gray-200 h-25 cursor-pointer ${
                        selectedChat === index ? 'bg-blue-50' : ''
                    }`}
                >
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                            {contact.userImgUrl}
                        </div>
                        {contact.isOnline && (
                            <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{contact.userName}</h3>
                            <span className="text-xs text-gray-500">{contact.messageTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-md text-gray-600 truncate">{contact.lastMessage}</p>
                            {contact.unreadMessages > 0 && (
                                <span
                                    className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 min-w-5 text-center justify-center">
                      {contact.unreadMessages}
                    </span>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ChatTabs;