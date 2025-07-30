import {useState} from 'react'
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
import { useLocation, useMatch } from "react-router";


export async function loader ({request} : Route.LoaderArgs) {
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

    const lastMessageFetch = await fetch (`${process.env.REST_API_URL}/message/${session.data.user?.userId}/lastMessage`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then (res => {
            if (!res.ok) {
                throw new Error('failed to fetch last message')
            }
            return res.json()
        })


    const lastMessage = PartnerMessageSchema.array().parse(lastMessageFetch.data)

    return {session, lastMessage }
}

export default function MessagingApp  ({loaderData} : Route.ComponentProps) {
    const {session, lastMessage} = loaderData;
    // const {session, lastMessage, userMessages} = loaderData;
    const initialUser = session.data.user;
    const [isSelected, setIsSelected] = useState(0);

    const location = useLocation();
    const isRootMessaging = useMatch("/chat")

    return (
        <div className="flex bg-white">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
                        <div className="flex gap-2">

                            <div
                                className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
                                id="language-dropdown-menu">
                                <ul className="py-2 font-medium" role="none">
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg aria-hidden="true" className="h-3.5 w-3.5 rounded-full me-2"
                                                     xmlns="<http://www.w3.org/2000/svg>" id="flag-icon-css-us"
                                                     viewBox="0 0 512 512">
                                                    <g fill-rule="evenodd">
                                                        <g stroke-width="1pt">
                                                            <path fill="#bd3d44"
                                                                  d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                                                  transform="scale(3.9385)"/>
                                                            <path fill="#fff"
                                                                  d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                                                  transform="scale(3.9385)"/>
                                                        </g>
                                                        <path fill="#192f5d" d="M0 0h98.8v70H0z"
                                                              transform="scale(3.9385)"/>
                                                        <path fill="#fff"
                                                              d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                                                              transform="scale(3.9385)"/>
                                                    </g>
                                                </svg>
                                                individual
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg className="h-3.5 w-3.5 rounded-full me-2" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-de"
                                                     viewBox="0 0 512 512">
                                                    <path fill="#ffce00" d="M0 341.3h512V512H0z"/>
                                                    <path d="M0 0h512v170.7H0z"/>
                                                    <path fill="#d00" d="M0 170.7h512v170.6H0z"/>
                                                </svg>
                                                groups
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg className="h-3.5 w-3.5 rounded-full me-2" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-it"
                                                     viewBox="0 0 512 512">
                                                    <g fill-rule="evenodd" stroke-width="1pt">
                                                        <path fill="#fff" d="M0 0h512v512H0z"/>
                                                        <path fill="#009246" d="M0 0h170.7v512H0z"/>
                                                        <path fill="#ce2b37" d="M341.3 0H512v512H341.3z"/>
                                                    </g>
                                                </svg>
                                                Individuals + Groups
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <nav className=""></nav>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <FaSearch size={20} className="text-gray-600"/>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <FaSearch size={16} className="absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search Messenger"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" >
                    {lastMessage.map((lastMessage) => (
                        <NavLink to={`/chat/${lastMessage.partnerId}`}   className="">
                        <ChatTabs  partnerMessage={lastMessage}/>
                        </NavLink>
                    ))}
                </div>
            </div>

            {isRootMessaging ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
                    <p>Select a chat to start messaging.</p>
                </div>
            ) : (
                <Outlet />
            )}

        </div>
    );
};




{/*<button className="p-2 hover:bg-gray-100 rounded-full">*/}
{/*    <FaPlus size={20} className="text-gray-600"/>*/}
{/*</button>*/}
{/*<button type="button" data-dropdown-toggle="language-dropdown-menu"*/}
{/*        className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm bg-gray-300  onClick-bg-gray 400 text-gray-900 rounded-lg cursor-pointer hover:bg-gray-200">*/}
{/*    <svg className="w-5 h-5 rounded-full me-3" aria-hidden="true"*/}
{/*         xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink"*/}
{/*         viewBox="0 0 3900 3900">*/}
{/*        <path fill="#b22234" d="M0 0h7410v3900H0z"/>*/}
{/*        <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff"*/}
{/*              stroke-width="300"/>*/}
{/*        <path fill="#3c3b6e" d="M0 0h2964v2100H0z"/>*/}
{/*        <g fill="#fff">*/}
{/*            <g id="d">*/}
{/*                <g id="c">*/}
{/*                    <g id="e">*/}
{/*                        <g id="b">*/}
{/*                            <path id="a"*/}
{/*                                  d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"/>*/}
{/*                            <use href="#a" y="420"/>*/}
{/*                            <use href="#a" y="840"/>*/}
{/*                            <use href="#a" y="1260"/>*/}
{/*                        </g>*/}
{/*                        <use href="#a" y="1680"/>*/}
{/*                    </g>*/}
{/*                    <use href="#b" x="247" y="210"/>*/}
{/*                </g>*/}
{/*                <use href="#c" x="494"/>*/}
{/*            </g>*/}
{/*            <use href="#d" x="988"/>*/}
{/*            <use href="#c" x="1976"/>*/}
{/*            <use href="#e" x="2470"/>*/}
{/*        </g>*/}
{/*    </svg>*/}
{/*    Individual*/}
{/*</button>*/}
{/*/!*Dropdown*!/*/}