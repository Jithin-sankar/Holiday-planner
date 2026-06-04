import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../auth/forgot.css';

function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');



    // SEND OTP
    const handleSendOTP = async () => {

        try {

            setLoading(true);
            setError('');
            setSuccess('');

            const response = await API.post(
                'accounts/forgot-password/',
                { email }
            );

            setSuccess(response.data.message);
            setStep(2);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                'Failed to send OTP'
            );

        } finally {

            setLoading(false);
        }
    };



    // VERIFY OTP
    const handleVerifyOTP = async () => {

        try {

            setLoading(true);
            setError('');
            setSuccess('');

            const response = await API.post(
                'accounts/verify-reset-otp/',
                {
                    email,
                    otp
                }
            );

            setSuccess(response.data.message);
            setStep(3);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                'Invalid OTP'
            );

        } finally {

            setLoading(false);
        }
    };



    // RESET PASSWORD
    const handleResetPassword = async () => {

        try {

            setLoading(true);
            setError('');
            setSuccess('');

            const response = await API.post(
                'accounts/reset-password/',
                {
                    email,
                    new_password: password
                }
            );

            setSuccess(response.data.message);

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                'Password reset failed'
            );

        } finally {

            setLoading(false);
        }
    };



    return (

        <div className="forgot-page">

            <div className="forgot-wrapper">

                {/* LEFT SIDE */}
                <div className="forgot-left">

                    <div className="logo">
                        TripNova
                    </div>

                    <h1 className="forgot-title">
                        Forgot Your Password?
                    </h1>

                    <p className="forgot-text">
                        Reset your password and continue
                        planning smarter trips with AI.
                    </p>

                    {error && (
                        <div className="forgot-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="forgot-success">
                            {success}
                        </div>
                    )}


                    {/* STEP 1 */}
                    {step === 1 && (

                        <div className="forgot-form">

                            <div className="input-group">

                                <label>Email Address</label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                            <button
                                className="forgot-btn"
                                onClick={handleSendOTP}
                                disabled={loading}
                            >

                                {
                                    loading
                                    ? 'Sending OTP...'
                                    : 'Send OTP'
                                }

                            </button>

                        </div>
                    )}


                    {/* STEP 2 */}
                    {step === 2 && (

                        <div className="forgot-form">

                            <div className="input-group">

                                <label>OTP Verification</label>

                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value)
                                    }
                                />

                            </div>

                            <button
                                className="forgot-btn"
                                onClick={handleVerifyOTP}
                                disabled={loading}
                            >

                                {
                                    loading
                                    ? 'Verifying...'
                                    : 'Verify OTP'
                                }

                            </button>

                        </div>
                    )}


                    {/* STEP 3 */}
                    {step === 3 && (

                        <div className="forgot-form">

                            <div className="input-group">

                                <label>New Password</label>

                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                            <button
                                className="forgot-btn"
                                onClick={handleResetPassword}
                                disabled={loading}
                            >

                                {
                                    loading
                                    ? 'Resetting...'
                                    : 'Reset Password'
                                }

                            </button>

                        </div>
                    )}


                    <div className="back-login">

                        <Link to="/">
                            Back To Login
                        </Link>

                    </div>

                </div>



                {/* RIGHT SIDE */}
                <div className="forgot-right">

                   


                    <div className="forgot-illustration">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png"
                            alt="forgot password"
                        />

                        <h2>
                            Secure Account Recovery
                        </h2>

                        <p>
                            Recover your account safely
                            using OTP verification.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;