import {CiCircleInfo} from "react-icons/ci";
import {BsFillSendFill} from "react-icons/bs";
import {useState} from "react";
import {MessageSchema} from "~/utils/models/message.model";
import {getSession} from "~/utils/session.server";
import type {Route} from "./+types/main-chat";
import * as z from "zod/v4";
import {redirect} from "react-router";
import {MessageBubble} from "~/components/MessageBubble";
import {UserSchema} from "~/utils/models/user-schema";

export async function loader({request, params}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const partnerId = params?.partnerId
if (!partnerId) {
    return {session, messages: [], partner: null}
}

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const partner = await fetch(`${process.env.REST_API_URL}/users/${partnerId}`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch partner info')
            }
            return res.json()
        })

    const userMessagesFetch = await fetch (`${process.env.REST_API_URL}/message/messageThread/${partnerId}`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then (res => {
            if (!res.ok) {
                throw new Error('failed to fetch user messages')
            }
            return res.json()
        })
    const partnerInfo = UserSchema.parse(partner.data)
    const messages = MessageSchema.array().parse(userMessagesFetch.data)
    const user = session.get('user')
    const authorization = session.get('authorization')
    if (!user || !authorization) {
        return redirect('/login')
    }

    return {session: {user}, messages, partnerInfo}

}


export default function MainChat({loaderData} : Route.ComponentProps) {
    // @ts-ignore
    const {session: {user}, messages, partnerInfo} = loaderData;


    const [newMessage, setNewMessage] = useState('');


    const messageHandler = () => {
        if (newMessage.trim()) {
            setNewMessage('');
        }
    }

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            messageHandler()
        }
    }
    return (
        <>
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                                <img
                                    alt={`${partnerInfo?.userName} profile picture`}
                                    key={partnerInfo?.userImgUrl}
                                    src={partnerInfo?.userImgUrl}
                                />
                            </div>
                        </div>
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-900">{partnerInfo?.userName}</h2>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <CiCircleInfo size={20} className="text-blue-500"/>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <MessageBubble  key={message.messageId} message={message} userId={user.userId} />
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
              <textarea
                  value={newMessage}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-12 max-h-32"
              />
                        </div>
                        <button
                            disabled={!newMessage.trim()}
                            className={`right-2 bottom-2 p-2 rounded-full ${
                                newMessage.trim()
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'cursor-not-allowed'
                            }`}
                        >
                            <BsFillSendFill size={30}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}