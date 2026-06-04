import { useState, useRef } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import API from '../api/api'

import '../auth/register.css'


function Register() {

    const navigate = useNavigate()

    const inputsRef = useRef([])

    const [showOTP, setShowOTP] =useState(false)

    const [otp, setOtp] = useState(['', '', '', '', '', ''])

    const [formData, setFormData] = useState({

        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
    })

    const [loading, setLoading] =useState(false)

    const [otpLoading, setOtpLoading] =useState(false)

    const [resendLoading, setResendLoading] =useState(false)

    const [error, setError] =useState('')

    const [success, setSuccess] =useState('')


 

    const handleChange = (e) => {setFormData({...formData,[e.target.name]: e.target.value})}


   

    const handleOTPChange = (
        value,
        index
    ) => {

        if (!/^\d*$/.test(value)) {
            return
        }

        const updatedOTP = [...otp]

        updatedOTP[index] = value

        setOtp(updatedOTP)

        if (
            value &&
            index < 5
        ) {

            inputsRef.current[
                index + 1
            ].focus()
        }
    }


  

    const handleKeyDown = (
        e,
        index
    ) => {

        if (
            e.key === 'Backspace'
            &&
            !otp[index]
            &&
            index > 0
        ) {

            inputsRef.current[
                index - 1
            ].focus()
        }
    }


  

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')

        setSuccess('')

        if (
            formData.password !==
            formData.confirm_password
        ) {

            setError(
                'Passwords do not match'
            )

            return
        }

        try {

            setLoading(true)

            const response =
            await API.post(

                'accounts/register/',
                formData
            )

            setSuccess(
                response.data.message
            )

            
            sessionStorage.setItem(

                'verify_email',
                formData.email
            )

          
            setShowOTP(true)

        } catch (error) {

            console.log(
                error.response?.data
            )
            if (error.response?.data) {

                const errors =
                    error.response.data

                const firstError =
                    Object.values(errors)[0]

                setError(

                    Array.isArray(firstError)

                    ? firstError[0]

                    : firstError

                    || 'Registration Failed'
                )

            } else {

                setError(
                    'Server Error'
                )
            }

        } finally {

            setLoading(false)
        }
    }


   

    const handleVerifyOTP = async (
        e
    ) => {

        e.preventDefault()

        setError('')

        setSuccess('')

        const finalOTP = otp.join('')

        if (finalOTP.length < 6) {

            setError(
                'Enter valid 6 digit OTP'
            )

            return
        }

        try {

            setOtpLoading(true)

            const response =
            await API.post(

                'accounts/verify-otp/',

                {
                    email:
                    formData.email,

                    otp: finalOTP
                }
            )

            setSuccess(
                response.data.message
            )

            sessionStorage.removeItem(
                'verify_email'
            )

            
            setOtp([
                '', '', '', '', '', ''
            ])

            setTimeout(() => {

                navigate('/')

            }, 1500)

        } catch (error) {

            console.log(error)

            if (error.response?.data) {

                setError(

                    error.response.data.error

                    || 'OTP Verification Failed'
                )

            } else {

                setError(
                    'Server Error'
                )
            }

        } finally {

            setOtpLoading(false)
        }
    }




    const handleResendOTP = async () => {

        setError('')

        setSuccess('')

        try {

            setResendLoading(true)

            const response =
            await API.post(

                'accounts/resend-otp/',

                {
                    email:
                    formData.email
                }
            )

            setSuccess(
                response.data.message
            )

        } catch (error) {

            console.log(error)

            setError(
                'Failed to resend OTP'
            )

        } finally {

            setResendLoading(false)
        }
    }


    return (

        <div className="register-page">

            <div className="register-wrapper">


                <div className="register-left">

                    <div className="register-logo">

                        TripNova

                    </div>


                    {
                        !showOTP ?

                        (

                            <>

                                <h1 className="register-heading">

                                    Create Your Account

                                </h1>


                                <p className="register-subtext">

                                    Start your smart AI travel
                                    experience today.

                                </p>


                                {
                                    error && (

                                        <div className="register-error">

                                            {error}

                                        </div>
                                    )
                                }


                                {
                                    success && (

                                        <div className="register-success">

                                            {success}

                                        </div>
                                    )
                                }


                                <form
                                    onSubmit={handleSubmit}
                                >

                                    <div className="input-group">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Enter full name"
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="input-group">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="input-group">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="register-grid">

                                        <div className="input-group">

                                            <label>
                                                Password
                                            </label>

                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        <div className="input-group">

                                            <label>
                                                Confirm Password
                                            </label>

                                            <input
                                                type="password"
                                                name="confirm_password"
                                                placeholder="Confirm password"
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        className="register-btn"
                                        disabled={loading}
                                    >

                                        {
                                            loading

                                            ? 'Creating Account...'

                                            : 'Create Account'
                                        }

                                    </button>

                                </form>


                                <div className="register-divider">

                                    <span>
                                        OR SIGN UP WITH
                                    </span>

                                </div>


                                <div className="login-link">

                                    Already have an account?

                                    <Link to="/login">

                                        Login

                                    </Link>

                                </div>

                            </>

                        )

                        :

                        (

                            <>

                                <div className="otp-icon-box">

                                    <img

                                        src="https://cdn-icons-png.flaticon.com/512/3125/3125713.png"

                                        alt="travel"

                                        className="otp-travel-image"
                                    />

                                </div>


                                <h1 className="register-heading">

                                    Verify Your Email

                                </h1>


                                <p className="otp-text">

                                    We sent a verification code to

                                </p>


                                <div className="otp-email">

                                    {formData.email}

                                </div>


                                {
                                    error && (

                                        <div className="register-error">

                                            {error}

                                        </div>
                                    )
                                }


                                {
                                    success && (

                                        <div className="register-success">

                                            {success}

                                        </div>
                                    )
                                }


                                <form
                                    onSubmit={handleVerifyOTP}
                                >

                                    <div className="otp-boxes">

                                        {
                                            otp.map((digit, index) => (

                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    ref={(el) =>
                                                        inputsRef.current[index] = el
                                                    }
                                                    onChange={(e) =>
                                                        handleOTPChange(
                                                            e.target.value,
                                                            index
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    className="otp-box"
                                                />
                                            ))
                                        }

                                    </div>


                                    <button
                                        type="submit"
                                        className="register-btn"
                                        disabled={otpLoading}
                                    >

                                        {
                                            otpLoading

                                            ? 'Verifying...'

                                            : 'Verify Email'
                                        }

                                    </button>

                                </form>


                                <button
                                    className="resend-btn"
                                    onClick={handleResendOTP}
                                    disabled={resendLoading}
                                >

                                    {
                                        resendLoading

                                        ? 'Sending...'

                                        : 'Resend Code'
                                    }

                                </button>

                            </>

                        )
                    }

                </div>


               

                <div className="register-right">

                    <div className="register-navbar">

                        <span>Home</span>

                        <span>Features</span>

                        <span>Pricing</span>

                        <span>Support</span>

                    </div>


                    <div className="register-image-content">

                        <img

                            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"

                            alt="travel"

                        />

                        <h2>

                            Smart AI Travel Platform

                        </h2>

                        <p>

                            Discover destinations,
                            manage trips, book hotels,
                            events and transport with
                            a modern AI-powered travel
                            ecosystem.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Register