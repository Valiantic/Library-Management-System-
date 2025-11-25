import { useState } from "react"
import "../../styles/LoginForm.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";


export default function LoginForm() {
    const {handleLoginStepOne, navigate, toastError} = useContext(AuthContext)
    
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)


    // Handle Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName.trim()) {
        toast.error("Username is required", { ...toastError });
        return;
        }

        if (!password.trim()) {
        toast.error("Password is required", { ...toastError });
        return;
        }

        setLoading(true);
        await handleLoginStepOne(userName, password);
        setLoading(false);
    };

    const handleSignUp = () => {
        navigate('/signup')
    }

  return (
    <div className="login-container">
        {loading && <Loading />}

        {/* Left Section */}
        <div className="login-left">
            <img src={assets.cover_photo} alt="Cover" className="cover-photo" />
            <div className="login-left-overlay"></div>

            <div className="login-left-content">
                <h1 className="library-title">CHIGGAS</h1>
                <p className="library-subtitle">LIBRARY</p>
                <p className="login-prompt">New to our platform? Sign Up now.</p>
                <button className="login-signup-button" onClick={handleSignUp}>
                    SIGN UP
                </button>
            </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
            <div className="login-form-container">
                <h2 className="login-title">Welcome Back !!</h2>
                <p className="login-subtitle">Enter your credentials to access your account.</p>

                <form onSubmit={handleSubmit} className="login-form">

                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="form-input"
                        disabled={loading}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        disabled={loading}
                    />

                    {/* Submit Button */}
                    <button type="submit" className="login-button" disabled={loading || !userName || !password}>
                        {loading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
