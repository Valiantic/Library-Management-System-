import { useEffect, useState } from "react"
import "../../styles/LoginVerification.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";

export default function LoginVerification() {
    const { loginSessionToken, handleLoginStepTwo, navigate, toastError} = useContext(AuthContext)
    
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
            toast.error("Please enter your verification code.", {...toastError});
            return;
        }

        setLoading(true);
        await handleLoginStepTwo(loginSessionToken, verificationCode);
        setLoading(false);

    }

    const handleBack = () => {
        navigate('/login')
    }

    useEffect(() => {
    if (!loginSessionToken) {
      navigate('/login');
    }
  }, [loginSessionToken]);

  return (
    <div className="login-verification-container">
        {loading && <Loading />}

        {/* Left Section */}
        <div className="login-verification-left">
            <img src={assets.cover_photo} alt="Cover" className="login-verification-cover-photo" />
            <div className="login-verification-overlay"></div>

            <div className="login-verification-left-content">
                <h1 className="login-verification-title">CHIGGAS</h1>
                <p className="login-verification-subtitle">LIBRARY</p>
                <p className="login-verification-text">"Your premier digital library for borrowing and reading books"</p>
            </div>
        </div>

        {/* Right Section */}
        <div className="login-verification-right">
            <div className="login-verification-form-container">
                <h2 className="login-verification-header">Check your Mailbox</h2>
                <p className="login-verification-description">Please enter the OTP to proceed</p>

                <form onSubmit={handleSubmit} className="login-verification-form">
                    <div className="login-verification-form-row">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={verificationCode}
                            onChange={handleVerifyCode}
                            className="login-verification-otp-input"
                            disabled={loading}
                            placeholder="OTP"
                            required
                        />
                    </div>

                    <button type="submit" className="login-verification-submit-button" disabled={loading || verificationCode.length !== 6}>
                        {loading ? "VERIFYING..." : "VERIFY"}
                    </button>
                </form>
            </div>
            <button className="login-verification-back-button" onClick={handleBack}>
                BACK
            </button>
        </div>
    </div>
  )
}
