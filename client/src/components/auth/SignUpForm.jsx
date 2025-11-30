import { useState } from "react"
import "../../styles/SignUpForm.css"
import { Bounce, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loading from "../Loading.jsx";
import { assets } from "../../assets/assets";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

export default function SignUpForm() {
    const {handleSignUpStepOne, navigate, toastError} = useContext(AuthContext)
    const [passwordType, setPasswordType] = useState('password');
    const [loading, setLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        userName: "",
        password: "",
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, emailAddress, userName, password } = formData;

        if (!firstName.trim()) {
            toast.error("First name is required", { ...toastError });
            return;
        }

        if (!lastName.trim()) {
            toast.error("Last name is required", { ...toastError });
            return;
        }

        if (!emailAddress.trim()) {
            toast.error("Email is required", { ...toastError });
            return;
        }

        if (!userName.trim()) {
            toast.error("Username is required", { ...toastError });
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required", { ...toastError });
            return;
        }

        setLoading(true);
        await handleSignUpStepOne(firstName, lastName, emailAddress, userName, password);
        setLoading(false);

        
    }

    const handleSignIn = () => {
        navigate('/')
    }

    const togglePassword = () => {
        setPasswordType((prevPasswordType) => 
        prevPasswordType === 'password' ? 'text' : 'password'
        );
    };

  return (
    <div className="signup-container">
        {loading && <Loading/>}
        {/* Left Section - Library Background */}
        <div className="signup-left">
            <img src={assets.cover_photo} alt="Cover" className="cover-photo" />
            <div className="signup-left-overlay"></div>

            <div className="signup-left-content">
                <h1 className="library-title">CHIGGAS</h1>
                <p className="library-subtitle">LIBRARY</p>
                <p className="forgot-text">Central Hub for IT Guides, Graphical resources, And Study materials</p>
                <p className="signin-prompt">Already have Account? Sign in now.</p>
                <button className="signin-button" onClick={handleSignIn}>
                SIGN IN
                </button>
            </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="signup-right">
            <div className="signup-form-container">
            <h2 className="signup-title">Sign Up</h2>
            <p className="signup-subtitle">Please provide your information to sign up.</p>


            <form onSubmit={handleSubmit} className="signup-form">
                {/* First Name and Last Name Row */}
                <div className="form-row">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={loading}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={loading}
                />
                </div>

                {/* Email - Full Width */}
                <input
                type="email"
                name="emailAddress"
                placeholder="Email"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="form-input full-width"
                disabled={loading}
                />

                {/* Username and Password Row */}
                <div className="form-row">
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={loading}
                    />

                    <div className="signup-password">
                        <input
                            type={passwordType}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-input"
                            disabled={loading}
                        />
                        <button type="button" onClick={togglePassword} className="toggle-password-btn-signup">
                            {passwordType === 'password' ? <IoIosEyeOff/> : <IoIosEye/>}
                        </button>
                    </div>
                
                </div>

                {/* Submit Button */}
                <button type="submit" className="signup-button" disabled={loading}>
                {loading ? "SIGNING UP..." : "SIGN UP"}
                </button>
            </form>
            </div>
        </div>
    </div>
  )
}
