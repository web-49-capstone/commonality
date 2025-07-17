import type {User} from "~/types/user";
import type {Message} from "~/types/message"

interface ChatTabProps {
    user: User
    message: Message
}

//     setSelectedChat: (index: number) => void;
//     selectedChat: number;
//     index: number;
// }

const ChatTabs = ({user, message} : ChatTabProps) =>

{
    return (
        <div className="flex-1 overflow-y-auto">
                <div
                    onClick={() => setIsSelected(index)}
                    className={`flex items-center p-3  hover:bg-gray-200 h-25 cursor-pointer ${
                        selectedChat === index ? 'bg-blue-50' : ''
                    }`}
                >
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                            {user.userImgUrl}
                        </div>
                        {user.isOnline && (
                            <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{user.userName}</h3>
                            <span className="text-xs text-gray-500">{message.messageSentAt}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-md text-gray-600 truncate">${message}</p>
                                <span
                                    className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 min-w-5 text-center justify-center">
                      {message.messageOpened}
                    </span>
                            )
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ChatTabs;