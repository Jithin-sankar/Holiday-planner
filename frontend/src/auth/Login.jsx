import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../auth/Login.css';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);

            
            const response = await API.post(
                'accounts/login/',
                formData,
                { withCredentials: true }
            );

          
            const userData = response.data.user;

            if (userData.is_admin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            console.log(error);
            if (error.response?.data) {
                const err = error.response.data;
                const firstError = Object.values(err)[0];
                setError(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : firstError || 'Login Failed'
                );
            } else {
                setError('Server Error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');

            // 1. Send Google token. Django sets the HTTP-Only cookie automatically.
            const response = await API.post(
                'accounts/google-login/',
                { token: credentialResponse.credential },
                { withCredentials: true }
            );

            // 2. Read the response to route the user
            const userData = response.data.user;

            if (userData.is_admin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            console.log(error);
            setError('Google Login Failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">

                <div className="login-left">
                    <div className="logo">TripNova</div>
                    <h1 className="hero-title">Travel Planning Platform</h1>
                    <p className="hero-text">
                        Plan smarter trips, book hotels, events, movies,
                        and manage your entire holiday journey.
                    </p>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="forgot-password-link">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Login'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>OR CONTINUE WITH</span>
                    </div>

                    <div className="google-login-box">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                        />
                    </div>

                    <div className="signup-text">
                        Don't have an account?
                        <Link to="/register"> Create Account</Link>
                    </div>
                </div>

                <div className="login-right">
                    <div className="navbar">
                        <span>Home</span>
                        <span>Features</span>
                        <span>Pricing</span>
                        <span>Contact</span>
                    </div>

                    <div className="illustration-section">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                            alt="travel"
                        />
                        <h2>Smart Travel Experience</h2>
                        <p>Planning and booking experience for modern travelers.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;