import {useState} from "react";



export function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const handleInputChange = (e: any) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isLogin) {
            console.log("Logging in with", formData);
        } else {
            console.log("Signing up with", formData);
        }
    };

    return (
        <div className="container mx-auto text-center">
            <h1 className="text-4xl">Welcome to Commonality</h1>
            <p>Shared Interests. Real Connections</p>
            <div className="min-h-screen  text-white flex flex-col items-center justify-center p-4">
                {/* Header Toggle */}
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`text-xl px-4 py-2 rounded ${
                            isLogin ? "bg-red-600" : "bg-zinc-800"
                        }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`text-xl px-4 py-2 rounded ${
                            !isLogin ? "bg-red-600" : "bg-zinc-800"
                        }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Dynamic Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-800 p-6 rounded-xl space-y-4 w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>

                    <input
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                        value={formData.email}
                        placeholder="Email"
                        className="w-full p-2 rounded bg-zinc-700 text-white"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        value={formData.password}
                        placeholder="Password"
                        className="w-full p-2 rounded bg-zinc-700 text-white"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-white"
                    >
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    )
}