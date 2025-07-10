import {useState} from "react";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {BiHide} from "react-icons/bi";
import {BiShow} from "react-icons/bi";
import {IconContext} from "react-icons";
import { signIn, signUp } from "../utils/auth";
import { useNavigate } from "react-router-dom";


export function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const navigate = useNavigate();
    const handleInputChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMessage("");
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            let result;
            if (isLogin) {
                result = await signIn(formData.email, formData.password);
            } else {
                result = await signUp(formData.email, formData.password);
            }
            if (result.status === 200) {
                // Store user session (could be improved with context/auth provider)
                localStorage.setItem("user", JSON.stringify(result.data));
                navigate("/my-profile"); // Redirect to profile page after login/signup
            } else {
                setErrorMessage(result.message || "Authentication failed");
            }
        } catch (err) {
            setErrorMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="container mx-auto text-center px-2 md:px-0">
            <h1 className="text-3xl md:text-4xl mt-4">Welcome to Commonality</h1>
            <p className="mb-2 md:mb-4">Shared Interests. Real Connections</p>
            <div className="text-white flex flex-col items-center justify-center p-2 md:p-4">
                <div className="flex space-x-2 md:space-x-4 mb-4 md:mb-6">
                    <button
                        className={`text-base md:text-xl px-3 md:px-4 py-2 rounded ${
                            isLogin ? "bg-blue-600" : "bg-zinc-300"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`text-base md:text-xl px-3 md:px-4 py-2 rounded ${
                            !isLogin ? "bg-blue-600" : "bg-zinc-300"
                        }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-300 p-4 md:p-6 rounded-xl space-y-3 md:space-y-4 w-full max-w-xs md:max-w-sm"
                >
                    <h2 className="text-xl md:text-2xl font-bold">
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

                    {isLogin ? <a className="flex justify-start text-sm hover:text-red-600">Forgot Password?</a> : <>
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
                    </>}

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