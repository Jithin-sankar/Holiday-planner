import { useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import API from '../api/api'

import '../auth/Otp.css'


function VerifyOTP() {

    const navigate = useNavigate()

    const email = sessionStorage.getItem(
        'verify_email'
    )

    const [otp, setOtp] = useState([
        '', '', '', '', '', ''
    ])

    const inputsRef = useRef([])

    const [loading, setLoading] =
    useState(false)

    const [resendLoading, setResendLoading] =
    useState(false)

    const [error, setError] =
    useState('')

    const [success, setSuccess] =
    useState('')


    const handleChange = (value, index) => {

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

        const finalOTP = otp.join('')

        try {

            setLoading(true)

            const response =
            await API.post(

                'accounts/verify-otp/',

                {
                    email,
                    otp: finalOTP
                }
            )

            setSuccess(
                response.data.message
            )

            sessionStorage.removeItem(
                'verify_email'
            )

            setTimeout(() => {

                navigate('/login')

            }, 1500)

        } catch (error) {

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

            setLoading(false)
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

                { email }
            )

            setSuccess(
                response.data.message
            )

        } catch (error) {

            setError(
                'Failed to resend OTP'
            )

        } finally {

            setResendLoading(false)
        }
    }


    return (

        <div className="otp-page">

            <div className="otp-card">

                <div className="otp-logo">

                    TripNova

                </div>


                <div className="otp-icon-box">

                    <img

                        src="https://cdn-icons-png.flaticon.com/512/2200/2200326.png"

                        alt="travel"

                        className="otp-travel-image"
                    />

                </div>


                <h1 className="otp-title">

                    Verify Your Email

                </h1>


                <p className="otp-text">

                    Enter the 6 digit verification
                    code sent to your email address

                </p>


                <div className="otp-email">

                    {email}

                </div>


                {
                    error && (

                        <div className="otp-error">

                            {error}

                        </div>
                    )
                }


                {
                    success && (

                        <div className="otp-success">

                            {success}

                        </div>
                    )
                }


                <form
                    onSubmit={handleSubmit}
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
                                        handleChange(
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
                        className="otp-btn"
                    >

                        {
                            loading

                            ? 'Verifying...'

                            : 'Verify Email'
                        }

                    </button>

                </form>


                <button
                    className="resend-btn"
                    onClick={handleResendOTP}
                >

                    {
                        resendLoading

                        ? 'Sending...'

                        : 'Resend Code'
                    }

                </button>

            </div>

        </div>
    )
}

export default VerifyOTP