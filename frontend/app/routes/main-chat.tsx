import {CiCircleInfo} from "react-icons/ci";
import {BsFillSendFill} from "react-icons/bs";
import {useEffect, useRef, useState} from "react";
import {MessageSchema} from "~/utils/models/message.model";
import {getSession} from "~/utils/session.server";
import type {Route} from "./+types/main-chat";
import * as z from "zod/v4";
import {Form, Link, redirect, useActionData, useLocation, useParams, useRevalidator} from "react-router";;
import { ProfilePreview} from "~/components/ProfilePreview";
import {MessageBubble} from "~/components/MessageBubble";
import {UserSchema} from "~/utils/models/user-schema";
import {v7 as uuidv7} from "uuid"

export const handle = {
    id: 'main-chat',
    // @ts-ignore
    shouldRevalidate: ({currentUrl, nextUrl, formMethod, defaultShouldRevalidate}) => {
        return defaultShouldRevalidate;
    }
};


export async function loader({request, params}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const partnerId = params?.partnerId
    if (!partnerId) {
        return {session, messages: [], partner: null}
    }
    console.log("is this running?")
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

    const userMessagesFetch = await fetch(`${process.env.REST_API_URL}/message/messageThread/${partnerId}`, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(res => {
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

export async function action({request, params}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const user = session.get('user')
    const authorization = session.get('authorization')
    if (!user || !authorization) {
        return redirect('/login')
    }
    const formData = await request.formData()
    const newMessage = Object.fromEntries(formData)
    const partnerId = params?.partnerId

    const message = {
        messageId: uuidv7(),
        messageSenderId: user.userId,
        messageReceiverId: partnerId,
        messageBody: newMessage.messageBody,
        messageOpened: false,
        messageSentAt: null
    }

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }


    const response = await fetch(`${process.env.REST_API_URL}/message`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(message)
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error('failed to send message')
    }
    return {status: 200, message: 'Message sent successfully', success: true}
}

function useAutoRevalidate(interval = 10000) {
    const revalidator = useRevalidator();
    const location = useLocation();

    useEffect(() => {
        const timer = setInterval(() => {
            if (revalidator.state === 'idle') {
                revalidator.revalidate();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [revalidator, interval, location.pathname]); // depend on pathname to restart on nav
}


export default function MainChat({loaderData}: Route.ComponentProps) {
    // @ts-ignore
    const {session: {user}, messages, partnerInfo} = loaderData;
    const actionData = useActionData<{ success: boolean }>();
    const formRef = useRef<HTMLFormElement>(null);
    useAutoRevalidate(10000)

    useEffect(() => {
        if (actionData?.success) {
            formRef.current?.reset();
        }
    }, [actionData]);
    const [showPreview, setShowPreview] = useState(false);


    return (
        <>
            <div className="flex-1 h-[40rem] flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-[5em] h-[5em] rounded-full overflow-hidden">
                                <Link to={`/user/${partnerInfo?.userId}`}>
                                    <img
                                        className="object-cover w-full h-full"
                                        alt={`${partnerInfo?.userName} profile picture`}
                                        key={partnerInfo?.userImgUrl}
                                        src={partnerInfo?.userImgUrl}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h2 className="font-semibold text-2xl text-gray-900">{partnerInfo?.userName}</h2>
                        </div>
                    </div>
                    <div className="flex gap-3 relative">
                      <Link to={`/user/${partnerInfo?.userId}`}>
                        <button className="p-2 hover:bg-gray-100 rounded-full" type="button"
                                onMouseEnter={() => {
                                    setShowPreview(true)}}
                                onMouseLeave={() => setShowPreview(false)}
                        >
                            <CiCircleInfo size={30} className="text-blue-500 font-extrabold"/>
                        </button>
                      </Link>
                        {showPreview && partnerInfo && (
                            <ProfilePreview user={partnerInfo} />
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 max-h-3/4 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <MessageBubble key={message.messageId} message={message} userId={user.userId}/>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <Form method="post" id="sendMessage" ref={formRef}>
            <div className="flex justify-around items-center relative">
              <textarea
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-12 max-h-32"
                  name="messageBody"
                  placeholder="Type a message..."
              />
                                <button
                                    className='ml-3 float-right right-2 bottom-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600'
                                    type="submit"
                                >
                                    <BsFillSendFill size={30}/>
                                </button>
                              </div>
                            </Form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}