import { useState } from "react"
import "../../styles/ForgotPasswordForm.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";


export default function ForgotPasswordForm() {
    const { handleForgotPasswordStepOne, navigate, toastError } = useContext(AuthContext)

    const [emailAddress, setEmailAddress] = useState("");
    const [loading, setLoading] = useState(false)


    // Handle Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailAddress.trim()) {
            toast.error("Email is required", { ...toastError });
            return;
        }

        setLoading(true);
        await handleForgotPasswordStepOne(emailAddress);
        setLoading(false);
    };

    const handleBack = () => {
        navigate('/login')
    }

    return (
        <div className="forgot-container">
            {loading && <Loading />}

            {/* Left Section */}
            <div className="forgot-left">
                <img src={assets.cover_photo} alt="Cover" className="forgot-cover-photo" />
                <div className="forgot-left-overlay"></div>

                <div className="forgot-left-content">
                    <h1 className="forgot-title">Aurevia Library Management System</h1>
                    <p className="forgot-subtitle">LIBRARY</p>
                    <p className="forgot-text">Central Hub for IT Guides, Graphical resources, And Study materials</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="forgot-right">
                <div className="forgot-form-container">
                    <h2 className="forgot-header">Forgot Password</h2>
                    <p className="forgot-description">Please enter your email</p>

                    <form onSubmit={handleSubmit} className="forgot-form">

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            className="forgot-input"
                            disabled={loading}
                            required
                        />

                        <button type="submit" className="forgot-button" disabled={loading || !emailAddress}>
                            {loading ? 'SENDING...' : 'SEND VERIFICATION CODE'}
                        </button>
                    </form>
                </div>

                <button className="forgot-back-button" onClick={handleBack}>
                    BACK
                </button>
            </div>
        </div>
    )
}
