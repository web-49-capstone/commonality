import {ImProfile} from "react-icons/im";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {IconContext} from "react-icons";
import {BiHide, BiShow} from "react-icons/bi";
import {GiConfirmed} from "react-icons/gi";
import {Form, redirect, useActionData, useNavigate} from "react-router";
import {useState} from "react";
import type {Route} from "../+types/root";
import * as process from "node:process";



export async function action({request}: Route.ActionArgs) {
    const formData = await request.formData()
    const user = Object.fromEntries(formData)
const response = await fetch(`${process.env.REST_API_URL}/sign-up`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
})
const data = await response.json();
console.log(data);
if (data.status === 200) {
    return redirect("/login?message=Please check your email to verify your account")
}
}
export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const actionData = useActionData();



    return (
        <>
            <div className="container mx-auto text-center">
                <h1 className="text-4xl">Welcome to Commonality</h1>
                <p>Shared Interests. Real Connections</p>
                <div className="  text-white flex flex-col items-center justify-center p-4">
                    <div className="flex space-x-4 mb-6">
                        <button className="text-xl px-4 py-2 rounded bg-zinc-300 hover:bg-zinc-600 hover:cursor-pointer" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="text-xl px-4 py-2 rounded bg-blue-600">
                            Sign Up
                        </button>
                    </div>
            <Form id="signup" method="post" className="bg-zinc-300 p-6 rounded-xl space-y-4 w-full max-w-sm">
                <div className='relative'>
                    <ImProfile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>

                    <input
                        type="text"
                        name="userName"
                        placeholder="Full Name"
                        className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                        required

                    />
                </div>
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
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>

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
                                className='text-sm text-white absolute right-2 top-1/2 transform -translate-y-1/2'>{showPassword ?
                            <BiHide/> : <BiShow/>
                        }</button>
                    </IconContext.Provider>
                </div>

                    <div className='relative'>
                        <GiConfirmed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="userPasswordConfirm"
                            placeholder="Confirm Password"
                            className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                            required
                        />
                        <IconContext.Provider value={{size: '1.5em'}}>
                            <button type='button'
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className='text-sm text-white absolute right-2 top-1/2 transform -translate-y-1/2'>{showConfirmPassword ?
                                <BiHide/> : <BiShow/>}</button>
                        </IconContext.Provider>
                    </div>
                    {errorMessage && <p className='text-red-600 text-sm '>{errorMessage}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
                    >Sign Up
                    </button>

            </Form>
                </div>
            </div>
        </>
    )
}