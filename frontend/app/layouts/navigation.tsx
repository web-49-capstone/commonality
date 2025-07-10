import {MdOutlineMessage} from "react-icons/md";
import {PiPlugsConnectedFill} from "react-icons/pi";
import {CgProfile} from "react-icons/cg";
import React, {useEffect, useState} from "react";
import {NavLink} from "react-router";


export function Navigation(){

    const desktopNavClasses = "flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2"
    const mobileNavClasses = "flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2"
    const desktopCurrentNavClasses = "flex items-center gap-2 text-lg text-blue-700 border-b-2 border-blue-700"
    const mobileCurrentNavClasses = "flex flex-col items-center gap-2 text-md text-blue-600 border-b-2"

    return (
        <>
            <nav>
                {/*DESKTOP HEADER*/}
                <div className="md:block bg-white border-b shadow-lg pb-2">
                    <div className="flex justify-center pt-1 md:py-3">
                        <img src="/commonality-logo.png" className="mr-3 h-10" alt="Flowbite React Logo" />
                        <h2 className="self-center whitespace-nowrap tracking-tight text-3xl font-semibold text-gray-800">Commonality</h2>
                    </div>
                    <div className="md:flex hidden justify-center items-center gap-10 min-h-8">
                        <NavLink to="/home" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>Home</NavLink> |
                        <NavLink to="/create-profile" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>Create Profile</NavLink> |
                        <NavLink to="/my-profile" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>My Profile</NavLink> |
                        <NavLink to="/user-profile-page" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>User Profile Page</NavLink> |
                        <NavLink to="/matching-begin" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>Matching Begin</NavLink> |
                        <NavLink to="/matching-profiles" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>Matching Profiles</NavLink> |
                        <NavLink to="/messages" className={({isActive}) => isActive ? desktopCurrentNavClasses : desktopNavClasses}>Messages</NavLink>
                    </div>

                </div>
                {/*MOBILE HEADER with FOOTER*/}
                <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-inner z-50 text-gray-700">
                    <div className="md:hidden flex flex-wrap justify-evenly items-center gap-3 px-2 py-2 min-h-20">
                        <NavLink to="/home" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>Home</NavLink> |
                        <NavLink to="/create-profile" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>Create Profile</NavLink> |
                        <NavLink to="/my-profile" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>My Profile</NavLink> |
                        <NavLink to="/user-profile-page" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>User Profile Page</NavLink> |
                        <NavLink to="/matching-begin" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>Matching Begin</NavLink> |
                        <NavLink to="/matching-profiles" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>Matching Profiles</NavLink> |
                        <NavLink to="/messages" className={({isActive}) => isActive ? mobileCurrentNavClasses : mobileNavClasses}>Messages</NavLink>
                    </div>
                    <div className={"bg-black text-gray-200 py-2 text-center italic text-xs"}>
                        <p>Copyright 2025 Commonality</p>
                    </div>
                </div>
            </nav>
        </>
    )
}