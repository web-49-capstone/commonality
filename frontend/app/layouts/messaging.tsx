import React, {useState} from 'react'
import 'flowbite'
import {FaSearch} from "react-icons/fa"
import {CiCircleInfo} from "react-icons/ci"
import {BsFillSendFill} from "react-icons/bs"
import {MessageBubble} from "~/components/MessageBubble"
import ChatTabs from "../components/ChatTabs"
import type {User} from "~/utils/types/user";
import type {Route} from "./+types/messaging";
import {getSession} from "~/utils/session.server";
import {NavLink, Outlet, redirect} from "react-router";
import {MessageSchema, PartnerMessageSchema} from "~/utils/models/message.model";
import type {Message} from "~/utils/types/message";
import {useLocation, useMatch, useParams} from "react-router";


export async function loader({request}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie"))


    if (!session.has("user")) {
        return redirect("/login")
    }
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    const lastMessageFetch = await fetch(`${process.env.REST_API_URL}/message/${session.data.user?.userId}/lastMessage`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch last message')
            }
            return res.json()
        })


    const lastMessage = PartnerMessageSchema.array().parse(lastMessageFetch.data || [])

    return {session, lastMessage}
}

/**
 * MessagingApp layout displays the messaging interface with chat sidebar and chat content.
 * Sidebar shows a list of chat partners and their last message.
 * Main content area displays the selected chat conversation.
 *
 * @param loaderData Contains session and lastMessage data from loader
 */
export default function MessagingApp({loaderData}: Route.ComponentProps) {
    const {session, lastMessage} = loaderData;
    // const {session, lastMessage, userMessages} = loaderData;
    const initialUser = session.data.user;
    const [isSelected, setIsSelected] = useState(0);

    const location = useLocation();
    const isRootMessaging = useMatch("/chat")
    const params = useParams();

    return (
        <div className="container mx-auto md:mt-10 md:shadow-md flex bg-white">
            {/* Sidebar: displays chat partners and last messages */}
            <div className={isRootMessaging ? ("w-full md:w-60 lg:w-80 bg-white border-r border-gray-200 flex flex-col") : ("hidden w-full md:w-60 lg:w-80 bg-white border-r border-gray-200 md:flex flex-col")}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex ml-2 items-center justify-between my-5">
                        <h1 className="text-nowrap text-4xl font-bold text-gray-900">Your Chats:</h1>
                    </div>
                </div>

                {/* Chat List: maps over lastMessage to show chat partners */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
                    {lastMessage.map((lastMessage) => (
                        <NavLink to={`/chat/${lastMessage.partnerId}`} className="">
                            <ChatTabs
                                partnerMessage={lastMessage}
                                isActive={params.partnerId === String(lastMessage.partnerId)}
                            />
                        </NavLink>
                    ))}
                </div>
            </div>

            <div id="MESSAGESBOX" className={isRootMessaging ? ("hidden md:block w-full") : ("w-full")}>
                {isRootMessaging ? (
                        <div className="text-center pt-20 text-red-900 text-xl hidden md:block">
                            <p className="text-center pt-20">Select a chat to start messaging.</p>
                        </div>
                ) : (
                    <Outlet/>
                )}
            </div>
        </div>
    );
};