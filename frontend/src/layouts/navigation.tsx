import {MdOutlineMessage} from "react-icons/md";
import {PiPlugsConnectedFill} from "react-icons/pi";
import {CgProfile} from "react-icons/cg";


export function Navigation() {
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
                        <a className="flex items-center gap-2  text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" href={"/messages"}><MdOutlineMessage />Messages</a> |
                        <a className="flex items-center gap-2  text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" href="/connect"><PiPlugsConnectedFill />Make Connections</a> |
                        <a className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-700 hover:border-b-2" href="/profile"><CgProfile />Profile</a>
                    </div>
                </div>
                {/*MOBILE HEADER with FOOTER*/}
                <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-inner z-50 text-gray-700">
                    <div className="md:hidden flex justify-evenly items-center gap-3 px-2 py-2 min-h-20">
                        <a className="flex flex-col items-center gap-2  text-md hover:text-blue-600 hover:border-b-2" href={"/messages"}><MdOutlineMessage />Messages</a> |
                        <a className="flex flex-col items-center gap-2  text-md hover:text-blue-600 hover:border-b-2" href="/connect"><PiPlugsConnectedFill />Make Connections</a> |
                        <a className="flex flex-col items-center gap-2 text-md hover:text-blue-600 hover:border-b-2" href="/profile"><CgProfile />Profile</a>
                    </div>
                    <div className={" bg-black text-gray-200 py-2 text-center italic text-xs"}>
                        <p>Copyright 2025 Commonality</p>
                    </div>
                </div>
            </nav>
        </>
    )
}

