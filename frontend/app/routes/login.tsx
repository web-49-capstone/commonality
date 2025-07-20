import {useEffect, useState} from "react";
import {Form, useNavigate, useSearchParams} from "react-router";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {IconContext} from "react-icons";
import {BiHide, BiShow} from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialMessage = searchParams.get("message");

    const [showToast, setShowToast] = useState(!!initialMessage);
    const [message, setMessage] = useState(initialMessage);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    return (
        <>
            <div className="container mx-auto text-center">
                {showToast && message && (
                    <div className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 shadow-md">
                        <span className="block sm:inline">{message}</span>
                        <button
                            className="ml-4"
                            onClick={() => setShowToast(false)}
                            aria-label="Close"
                        >
                            <AiOutlineClose className="h-5 w-5 text-green-700" />
                        </button>
                    </div>
                )}
            <h1 className="text-4xl">Welcome to Commonality</h1>
            <p>Shared Interests. Real Connections</p>
            <div className="  text-white flex flex-col items-center justify-center p-4">
                <div className="flex space-x-4 mb-6">
                    <button className="text-xl px-4 py-2 rounded bg-blue-600">
                        Login
                    </button>
                    <button className="text-xl px-4 py-2 rounded bg-zinc-300 hover:bg-zinc-600 hover:cursor-pointer" onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </div>

                    <Form id="login-form" className="bg-zinc-300 p-6 rounded-xl space-y-4 w-full max-w-sm">
                        <div className='relative'>

                            <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>
                            <input
                                type="email"
                                name="userEmail"
                                placeholder="Email"
                                className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                                required
                            />
                        </div>
                        <div className='relative'>
                            <RiLockPasswordLine
                                className="absolute left-3 top-1/5 transform -translate-y-1/2 text-white"/>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="userPassword"
                                placeholder="Password"
                                className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                                required
                            />
                            <IconContext.Provider value={{size: '1.5em'}}>
                                <button type='button'
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className='text-sm text-white absolute right-2 top-1/5 transform -translate-y-1/2'>{showPassword ?
                                    <BiHide/> : <BiShow/>
                                }</button>
                            </IconContext.Provider>
                            <button className=" flex justify-start text-sm hover:text-red-600 my-2">Forgot Password?</button>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
                            >Login
                            </button>
                        </div>
                    </Form>
            </div>
            </div>
        </>
    )
}