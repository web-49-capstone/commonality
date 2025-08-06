import type {User} from "~/utils/types/user";
import type {Message} from "~/utils/types/message"
import type {PartnerMessage} from "~/utils/models/message.model";
import {useParams} from "react-router";

interface ChatTabProps {
    // user: User
    // message: Message
    partnerMessage: PartnerMessage
    isActive?: boolean
}

//     setSelectedChat: (index: number) => void;
//     selectedChat: number;
//     index: number;
// }


const ChatTabs = ({partnerMessage, isActive = false} : ChatTabProps) =>

{
    return (
        <div className="flex-1 overflow-y-auto py-2 md:w-[16rem]">
            <div className={`hover:cursor-pointer border rounded-lg px-4 py-6 flex items-center transition-colors
                ${isActive
                ? "bg-gradient-to-br from-blue-50 to-blue-200 border-blue-200 text-blue-700 shadow"
                : "border-gray-200 bg-white"}`}>
                        <div
                            className="w-[3em] h-[3em] rounded-full overflow-hidden">
                            <img
                                className="object-cover w-full h-full"
                                alt={`${partnerMessage.partnerName} profile picture`}
                                key={partnerMessage.partnerImg}
                                src={partnerMessage.partnerImg}
                            />

                        </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{partnerMessage.partnerName}</h3>
                            <span className="text-xs text-gray-500">{partnerMessage.messageSentAt.toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit'
                            })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-md text-gray-600 truncate">{partnerMessage.messageBody}</p>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default ChatTabs;