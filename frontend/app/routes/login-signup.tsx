import {useState} from "react";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {BiHide} from "react-icons/bi";
import {BiShow} from "react-icons/bi";
import {IconContext} from "react-icons";


export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const handleInputChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match")
            return;
        }
        // Used later for backend call
        // if (isLogin) {
        // } else {
        // }
    };

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

                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-300 p-6 rounded-xl space-y-4 w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>
                    <div className='relative'>
                        <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>
                        <input
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            placeholder="Email"
                            className="w-full p-2 pl-10 rounded bg-zinc-500 text-white"
                            required
                        />
                    </div>
                    <div className='relative'>
                        <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"/>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
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

                    {isLogin ? <a className=" flex justify-start text-sm hover:text-red-600">Forgot Password?</a> : <>
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                onChange={handleInputChange}
                                value={formData.confirmPassword}
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

                    </>
                    }

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
                    >
                        {isLogin ? "Log In" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    )
}