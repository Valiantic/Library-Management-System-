import { useEffect, useState } from "react"
import "../../styles/ForgotPasswordVerification.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";

export default function ForgotPasswordVerification() {
    const { handleForgotPasswordStepTwo, navigate, toastError } = useContext(AuthContext)

    const [verificationCode, setVerificationCode] = useState('');

    const [loading, setLoading] = useState(false)

    const handleVerifyCode = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove all non-digit characters
        if (value.length > 6) {
            value = value.slice(0, 6); // Limit to 6 digits max
        }
        setVerificationCode(value);
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode) {
            toast.error("Please enter your verification code.", { ...toastError });
            return;
        }

        setLoading(true);
        await handleForgotPasswordStepTwo(verificationCode);
        setLoading(false);

    }

    const handleBack = () => {
        navigate('/login')
    }


    return (
        <div className="forgot-verification-container">
            {loading && <Loading />}

            {/* Left */}
            <div className="forgot-verification-left">
                <img src={assets.cover_photo} alt="Cover" className="forgot-verification-cover-photo" />
                <div className="forgot-verification-overlay"></div>

                <div className="forgot-verification-left-content">
                    <h1 className="forgot-verification-title">Aurevia Library Management System</h1>
                    <p className="forgot-verification-subtitle">LIBRARY</p>
                    <p className="forgot-verification-text">Central Hub for IT Guides, Graphical resources, And Study materials</p>
                </div>
            </div>

            {/* Right */}
            <div className="forgot-verification-right">
                <div className="forgot-verification-form-container">
                    <h2 className="forgot-verification-header">Check your Mailbox</h2>
                    <p className="forgot-verification-description">Please enter the OTP to proceed</p>

                    <form onSubmit={handleSubmit} className="forgot-verification-form">
                        <div className="forgot-verification-form-row">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={verificationCode}
                                onChange={handleVerifyCode}
                                className="forgot-verification-otp-input"
                                disabled={loading}
                                placeholder="OTP"
                                required
                            />
                        </div>

                        <button type="submit" className="forgot-verification-submit-button" disabled={loading || verificationCode.length !== 6}>
                            {loading ? "VERIFYING..." : "VERIFY"}
                        </button>
                    </form>
                </div>

                <button className="forgot-verification-back-button" onClick={handleBack}>
                    BACK
                </button>
            </div>
        </div>
    )
}
