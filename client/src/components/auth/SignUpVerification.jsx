import { useState } from "react"
import "../../styles/SignUpVerification.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";

export default function SignUpVerification() {
    const { signUpData, handleSignUpStepTwo, navigate, toastError } = useContext(AuthContext)

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

        if (!signUpData.registerKey) {
            toast.error("Verification expired or not initiated. Please try again", { ...toastError });
            return;
        }

        if (!verificationCode) {
            toast.error("Please enter your verification code.", { ...toastError });
            return;
        }

        setLoading(true);
        const success = await handleSignUpStepTwo(signUpData.registerKey, verificationCode);
        setLoading(false);
        if (success) {
            setVerificationCode("");
            navigate("/home")
        }

    }

    const handleBack = () => {
        navigate('/signup')
    }

    return (
        <div className="signup-verification-container">
            {loading && <Loading />}

            {/* Left Section */}
            <div className="signup-verification-left">
                <img src={assets.cover_photo} alt="Cover" className="signup-verification-cover-photo" />
                <div className="signup-verification-overlay"></div>

                <div className="signup-verification-left-content">
                    <h1 className="signup-verification-title">Aurevia Library Management System</h1>
                    <p className="signup-verification-subtitle">LIBRARY</p>
                    <p className="signup-verification-text">Central Hub for IT Guides, Graphical resources, And Study materials</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="signup-verification-right">
                <div className="signup-verification-form-container">
                    <h2 className="signup-verification-header">Check your Mailbox</h2>
                    <p className="signup-verification-description">Please enter the OTP to proceed</p>

                    <form onSubmit={handleSubmit} className="signup-verification-form">
                        <div className="signup-verification-form-row">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={verificationCode}
                                onChange={handleVerifyCode}
                                className="signup-verification-otp-input"
                                disabled={loading}
                                placeholder="OTP"
                                required
                            />
                        </div>

                        <button type="submit" className="signup-verification-submit-button" disabled={loading || verificationCode.length !== 6}>
                            {loading ? "VERIFYING..." : "VERIFY"}
                        </button>
                    </form>
                </div>
                <button className="signup-verification-back-button" onClick={handleBack}>
                    BACK
                </button>
            </div>
        </div>
    )
}
