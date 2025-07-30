import {useState} from "react";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {BiHide} from "react-icons/bi";
import {BiShow} from "react-icons/bi";
import {IconContext} from "react-icons";
import {ImProfile} from "react-icons/im";
import {GiConfirmed} from "react-icons/gi";
import {Form, redirect, useActionData, useSearchParams} from "react-router";
import type {Route} from "../+types/root";
import * as process from "node:process"

export async function action({request}: Route.ActionArgs) {
    const formData = await request.formData();
    console.log(formData);

    const user = {
        userName: formData.get('userName'),
        userEmail: formData.get('userEmail'),
        userPassword: formData.get('userPassword'),
        userPasswordConfirm: formData.get('userPasswordConfirm'),
    }

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
        return {success:true, message: data.message, status: 200}


    }
}


export default function LoginSignup() {
    const [searchParams] = useSearchParams();
    const isSignUp = searchParams.get('sign-up');
    const [isLogin, setIsLogin] = useState(isSignUp ? false : true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const actionData = useActionData();
    const successMessage = actionData?.success ? actionData.message : null;

    // if (!isLogin && formData.userPassword !== formData.userConfirmPassword) {
    //     setErrorMessage("Passwords do not match")
    //     return;
    // }

    return (
        <div className="container mx-auto text-center">
            <h1 className="text-4xl">Welcome to Commonality</h1>
            <p>Shared Interests. Real Connections</p>
            <div className="  text-white flex flex-col items-center justify-center p-4">
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`text-xl px-4 py-2 rounded ${
                            isLogin ? "bg-blue-600" : "bg-zinc-300"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`text-xl px-4 py-2 rounded ${
                            !isLogin ? "bg-blue-600" : "bg-zinc-300"
                        }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ?
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
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="userPassword"
                                placeholder="Password"
                                className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                                required

                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
                            >Login
                            </button>
                        </div>
                    </Form>
                    : <Form id="signup-form" method="post"
                            className="bg-zinc-300 p-6 rounded-xl space-y-4 w-full max-w-sm">
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
                        </div>
                    </Form>}
            </div>
            {successMessage && <p className='text-green-600 text-md '>User created successfully, please check your email for activation link.</p>}
            {/*    <form*/}
            {/*        onSubmit={handleSubmit}*/}
            {/*        className="bg-zinc-300 p-6 rounded-xl space-y-4 w-full max-w-sm"*/}
            {/*    >*/}
            {/*        <h2 className="text-2xl font-bold">*/}
            {/*            {isLogin ? "Login" : "Sign Up"}*/}
            {/*        </h2>*/}
            {/*            {isLogin ? "" :*/}
            {/*                <div className='relative'>*/}
            {/*                    <ImProfile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>*/}

            {/*                <input*/}
            {/*            type="text"*/}
            {/*            name="userName"*/}
            {/*            onChange={handleInputChange}*/}
            {/*            value={formData.userName}*/}
            {/*            placeholder="Full Name"*/}
            {/*            className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"*/}
            {/*            required*/}

            {/*            />*/}
            {/*                </div>*/}

            {/*            }*/}
            {/*        <div className='relative'>*/}

            {/*        <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>*/}
            {/*            <input*/}
            {/*                type="email"*/}
            {/*                name="userEmail"*/}
            {/*                onChange={handleInputChange}*/}
            {/*                value={formData.userEmail}*/}
            {/*                placeholder="Email"*/}
            {/*                className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"*/}
            {/*                required*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className='relative'>*/}
            {/*            <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>*/}

            {/*            <input*/}
            {/*                type={showPassword ? "text" : "password"}*/}
            {/*                name="password"*/}
            {/*                onChange={handleInputChange}*/}
            {/*                value={formData.userPassword}*/}
            {/*                placeholder="Password"*/}
            {/*                className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"*/}
            {/*                required*/}

            {/*            />*/}
            {/*            <IconContext.Provider value={{size: '1.5em'}}>*/}
            {/*                <button type='button'*/}
            {/*                        onClick={() => setShowPassword((prev) => !prev)}*/}
            {/*                        className='text-sm text-white absolute right-2 top-1/2 transform -translate-y-1/2'>{showPassword ?*/}
            {/*                    <BiHide/> : <BiShow/>*/}
            {/*                }</button>*/}
            {/*            </IconContext.Provider>*/}
            {/*        </div>*/}

            {/*        {isLogin ? <a className=" flex justify-start text-sm hover:text-red-600">Forgot Password?</a> : <>*/}
            {/*            <div className='relative'>*/}
            {/*                <GiConfirmed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>*/}
            {/*                <input*/}
            {/*                    type={showConfirmPassword ? "text" : "password"}*/}
            {/*                    name="confirmPassword"*/}
            {/*                    onChange={handleInputChange}*/}
            {/*                    value={formData.userConfirmPassword}*/}
            {/*                    placeholder="Confirm Password"*/}
            {/*                    className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"*/}
            {/*                    required*/}
            {/*                />*/}
            {/*                <IconContext.Provider value={{size: '1.5em'}}>*/}
            {/*                    <button type='button'*/}
            {/*                            onClick={() => setShowConfirmPassword((prev) => !prev)}*/}
            {/*                            className='text-sm text-white absolute right-2 top-1/2 transform -translate-y-1/2'>{showConfirmPassword ?*/}
            {/*                        <BiHide/> : <BiShow/>}</button>*/}
            {/*                </IconContext.Provider>*/}
            {/*            </div>*/}
            {/*            {errorMessage && <p className='text-red-600 text-sm '>{errorMessage}</p>}*/}

            {/*        </>*/}
            {/*        }*/}

            {/*        <button*/}
            {/*            type="submit"*/}
            {/*            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"*/}
            {/*        >*/}
            {/*            {isLogin ? "Log In" : "Create Account"}*/}
            {/*        </button>*/}
            {/*    </form>*/}
            {/*</div>*/}
        </div>
    )
}