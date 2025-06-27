import {MdOutlineMessage} from "react-icons/md";
import {PiPlugsConnectedFill} from "react-icons/pi";
import {CgProfile} from "react-icons/cg";
import {useEffect} from "react";
import {Link} from "react-router";


export function Navigation() {
    useEffect(() => {
        currentPageNav()
    }, [])

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
                        <Link id="desktop-messages-link" className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" to="/messages"><MdOutlineMessage />Messages</Link> |
                        <Link id="desktop-connect-link" className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" to="/connect"><PiPlugsConnectedFill />Make Connections</Link> |
                        <Link id="desktop-profile-link" className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" to="/profile"><CgProfile />Profile</Link>
                    </div>
                </div>
                {/*MOBILE HEADER with FOOTER*/}
                <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-inner z-50 text-gray-700">
                    <div className="md:hidden flex justify-evenly items-center gap-3 px-2 py-2 min-h-20">
                        <Link id="mobile-messages-link" className="flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2" to={"/messages"}><MdOutlineMessage />Messages</Link> |
                        <Link id="mobile-connect-link" className="flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2" to="/connect"><PiPlugsConnectedFill />Make Connections</Link> |
                        <Link id="mobile-profile-link" className="flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2" to="/profile"><CgProfile />Profile</Link>
                    </div>
                    <div className={" bg-black text-gray-200 py-2 text-center italic text-xs"}>
                        <p>Copyright 2025 Commonality</p>
                    </div>
                </div>
                <button onClick = {currentPageNav}>TEST BUTTON</button>
            </nav>
        </>
    )
}



function currentPageNav() {
    const loc = document.location
    const desktopMessagesLink = document.getElementById('desktop-messages-link');
    const mobileMessagesLink = document.getElementById('mobile-messages-link');
    const desktopConnectLink = document.getElementById('desktop-connect-link');
    const mobileConnectLink = document.getElementById('mobile-connect-link');
    const desktopProfileLink = document.getElementById('desktop-profile-link');
    const mobileProfileLink = document.getElementById('mobile-profile-link');
    if (loc.pathname === '/messages') {
        desktopMessagesLink.className = "flex items-center gap-2 text-lg text-blue-700 border-b-2 border-blue-700";
        mobileMessagesLink.className = "flex flex-col items-center gap-2 text-md text-blue-600 border-b-2";
    } if (loc.pathname === '/connect') {
        desktopConnectLink.className = "flex items-center gap-2 text-lg text-blue-700 border-b-2 border-blue-700";
        mobileConnectLink.className = "flex flex-col items-center gap-2 text-md text-blue-600 border-b-2";
    } if (loc.pathname === '/profile') {
        desktopProfileLink.className = "flex items-center gap-2 text-lg text-blue-700 border-b-2 border-blue-700";
        mobileProfileLink.className = "flex flex-col items-center gap-2 text-md text-blue-600 border-b-2";
    }
    console.log(document.location)
}