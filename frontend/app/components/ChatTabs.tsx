import type {User} from "~/utils/types/user";
import type {Message} from "~/utils/types/message"

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
                <div>
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl">
                            <img
                            alt={`${user.userName} profile picture`}
                            key={user.userImgUrl}
                            src={user.userImgUrl}
                            />

                        </div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{user.userName}</h3>
                            <span className="text-xs text-gray-500">{message.messageSentAt}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-md text-gray-600 truncate">{message.messageBody}</p>
                                <span
                                    className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 min-w-5 text-center justify-center">
                      {message.messageOpened}
                    </span>

                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ChatTabs;