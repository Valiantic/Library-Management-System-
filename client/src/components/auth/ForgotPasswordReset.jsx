import { useEffect, useState } from "react"
import "../../styles/ForgotPasswordReset.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";


export default function ForgotPasswordReset() {
    const {handleForgotPasswordStepThree, navigate, toastError, passwordResetSessionToken} = useContext(AuthContext)
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPasswordType, setNewPasswordType] = useState('password')
    const [confirmPasswordType, setConfirmPasswordType] = useState('password')


    // Handle Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword.trim()) {
            toast.error("New Password is required", { ...toastError });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match.", { ...toastError });
            return;
        }

        setLoading(true);
        await handleForgotPasswordStepThree(newPassword, passwordResetSessionToken);
        setLoading(false);
    };

    const handleBack = () => {
        navigate('/login')
    }

    const toggleNewPassword = () => {
        setNewPasswordType((prevPasswordType) => 
        prevPasswordType === 'password' ? 'text' : 'password'
        );
    };

    const toggleConfirmPassword = () => {
        setConfirmPasswordType((prevPasswordType) => 
        prevPasswordType === 'password' ? 'text' : 'password'
        );
    };

    useEffect(() => {
        if (!passwordResetSessionToken) {
        navigate('/login');
        }
    }, [passwordResetSessionToken]);

  return (
    <div className="reset-password-container">
        {loading && <Loading />}

        {/* Left Section */}
        <div className="reset-password-left">
            <img src={assets.cover_photo} alt="Cover" className="reset-password-cover-photo" />
            <div className="reset-password-overlay"></div>

            <div className="reset-password-left-content">
                <h1 className="reset-password-title">CHIGGAS</h1>
                <p className="reset-password-subtitle">LIBRARY</p>
                <p className="reset-password-text">Central Hub for IT Guides, Graphical resources, And Study materials</p>
            </div>
        </div>

        {/* Right Section */}
        <div className="reset-password-right">
            <div className="reset-password-form-container">
                <h2 className="reset-password-header">Reset Password</h2>
                <p className="reset-password-description">Please enter your new password</p>

                <form onSubmit={handleSubmit} className="reset-password-form">

                    <div className="new-password">
                        <input
                            type={newPasswordType}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="reset-password-input"
                            disabled={loading}
                            required
                        />
                        <button type="button" onClick={toggleNewPassword} className="toggle-password">
                            {newPasswordType === 'password' ? <IoIosEyeOff/> : <IoIosEye/>}
                        </button>
                    </div>

                    <div className="confirm-password">
                        <input
                            type={confirmPasswordType}
                            placeholder="Confirm Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="reset-password-input"
                            disabled={loading}
                            required
                        />
                        <button type="button" onClick={toggleConfirmPassword} className="toggle-password">
                            {confirmPasswordType === 'password' ? <IoIosEyeOff/> : <IoIosEye/>}
                        </button>
                    </div>

                    <button type="submit" className="reset-password-button" disabled={loading || !newPassword || !confirmNewPassword}>
                        {loading ? 'RESETTING' : 'RESET PASSWORD'}
                    </button>
                </form>
            </div>

            <button className="reset-password-back-button" onClick={handleBack}>
                BACK
            </button>
        </div>
    </div>
  )
}
