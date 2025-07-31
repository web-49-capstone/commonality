import {MdOutlineMessage} from "react-icons/md";
import {PiPlugsConnectedFill} from "react-icons/pi";
import {CgProfile} from "react-icons/cg";
import React, {useEffect, useState} from "react";
import {Link, NavLink, Outlet, redirect, useLoaderData} from "react-router";
import {Footer} from "~/layouts/footer";
import {getSession} from "~/utils/session.server";
import {fetchInterestsByInterestName, InterestSchema} from "~/utils/models/interest.model";
import type {Route} from "../../.react-router/types/app/routes/+types/main-chat";
import {ProfileMatchingSection} from "~/components/profile-matching-section";

export async function loader({request, params}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const userId = session.data.user?.userId
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const response = await fetch(`${process.env.REST_API_URL}/message/${userId}/unread`, {
        method: "GET",
        headers: requestHeaders,
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch unread messages')
            }
            return res.json()
        })
    return {unreadMessages: response.data || []}
}

export default function Navigation({loaderData}: Route.ComponentProps) {
    const {unreadMessages} = useLoaderData<typeof loader>()
    const desktopNavClasses = "flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2 transition-colors"
    const mobileNavClasses = "flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2 transition-colors"
    const desktopCurrentNavClasses = "flex items-center gap-2 text-lg text-blue-700 border-b-2 border-blue-700 transition-colors"
    const mobileCurrentNavClasses = "flex flex-col items-center gap-2 text-md text-blue-600 border-b-2 transition-colors"


    return (
        <>
        <div className="flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white shadow-md mb-30">
                {/*DESKTOP HEADER*/}
                <div className="md:block bg-white border-b shadow-lg pb-2">
                    <div className="flex justify-center pt-1 md:py-3">
                        <Link to="/">
                            <img src="/commonality-logo.png" className="mr-3 h-10" alt="Flowbite React Logo"/>
                        </Link>
                        <h2 className="self-center whitespace-nowrap tracking-tight text-3xl font-semibold text-gray-800">Commonality</h2>
                    </div>
                    <div className="md:flex hidden justify-center items-center gap-10 min-h-8">
                        <NavLink to="/chat" className={({
                                                            isActive,
                                                            isPending
                                                        }) => isActive ? desktopCurrentNavClasses : desktopNavClasses}><MdOutlineMessage/>Messages{unreadMessages.length !== 0 ? (
                            <div
                                className="text-white text-sm text-center w-5 mx-auto bg-blue-500 rounded-full">{unreadMessages.length}</div>
                        ) : (
                            ""
                        )}</NavLink>

                    |
                    <NavLink to="/connect" className={({
                                                           isActive,
                                                           isPending
                                                       }) => isActive ? desktopCurrentNavClasses : desktopNavClasses}><PiPlugsConnectedFill/>Make
                        Connections</NavLink>
                    |
                    <NavLink to="/profile"><span
                        className={desktopNavClasses}><CgProfile/>Profile</span></NavLink>
                </div>

        </div>
        {/*MOBILE HEADER with FOOTER*/}
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-inner z-50 text-gray-700">
            <div className="md:hidden flex justify-evenly items-center gap-3 px-2 py-2 min-h-20">
                <NavLink to="/chat" className={({
                                                        isActive,
                                                        isPending
                                                    }) => isActive ? mobileCurrentNavClasses : mobileNavClasses}><MdOutlineMessage/>Messages</NavLink> |
                <NavLink to="/connect" className={({
                                                       isActive,
                                                       isPending
                                                   }) => isActive ? mobileCurrentNavClasses : mobileNavClasses}><PiPlugsConnectedFill/>Make
                    Connections</NavLink> |
                <NavLink to="/profile" className={({
                                                       isActive,
                                                       isPending
                                                   }) => isActive ? mobileCurrentNavClasses : mobileNavClasses}><CgProfile/>Profile</NavLink>
            </div>
            <div className={"bg-black text-gray-200 py-2 text-center italic text-xs fixed bottom-0 w-full"}>
                <p>Copyright 2025 Commonality</p>
            </div>
        </div>
        </nav>
    <Outlet/>
</div>
</>
)
}