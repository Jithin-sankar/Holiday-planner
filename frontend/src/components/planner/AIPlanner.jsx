import './AIPlanner.css'

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import API from '../../api/api'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaWallet,
    FaMagic,
    FaSpinner,
    FaCheckCircle
} from 'react-icons/fa'

function AIPlanner() {

    const navigate = useNavigate()

    // FORM STATES
    const [destination, setDestination] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [travelers, setTravelers] = useState(1)
    const [budget, setBudget] = useState('')

    // AI STATES
    const [loading, setLoading] = useState(false)
    const [generatedPlan, setGeneratedPlan] = useState(null)

    // abort controller
    const abortControllerRef = useRef(null)

    // ============================
    // GENERATE AI PREVIEW
    // ============================
    const generateHolidayPlan = async (e) => {

        e.preventDefault()

        setLoading(true)

        abortControllerRef.current = new AbortController()

        try {

            // ONLY PREVIEW
            // NO DATABASE SAVE
            const response = await API.post(

                'itinerary/preview/',

                {
                    destination,
                    start_date: startDate,
                    end_date: endDate,
                    travelers,
                    budget
                },

                {
                    signal: abortControllerRef.current.signal
                }
            )

            setGeneratedPlan(response.data)

            toast.success('AI Holiday Plan Generated!')

        } catch (err) {

            if (
                err.name === 'CanceledError' ||
                err.code === 'ERR_CANCELED'
            ) {
                return
            }

            console.error(err)

            toast.error('Failed to generate holiday plan.')

        } finally {

            setLoading(false)
        }
    }

    // ============================
    // CANCEL
    // ============================
    const handleCancel = () => {

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        navigate('/dashboard')
    }

    // ============================
    // SAVE PLAN
    // ============================
    const saveHolidayPlan = async () => {

        try {

            setLoading(true)

            // 1. CREATE TRIP
            const tripResponse = await API.post(

                'trips/trips/',

                {
                    destination,
                    start_date: startDate,
                    end_date: endDate,
                    travelers,
                    budget
                }
            )

            const tripId = tripResponse.data.id

            // 2. SAVE ITINERARY
            await API.post(
                `itinerary/generate/${tripId}/`
            )

            toast.success('Holiday Saved Successfully!')

            navigate(`/trip/${tripId}`)

        } catch (err) {

            console.error(err)

            toast.error('Failed to save holiday.')

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="planner-page">

            <div className="planner-container split-layout">

                {/* LEFT SIDE */}
                <div className="planner-left-side">

                    <div className="planner-header">

                        <button
                            className="cancel-btn"
                            onClick={handleCancel}
                        >
                            ← Cancel
                        </button>

                        <div className="ai-badge">
                            <FaMagic />
                            AI Powered
                        </div>

                        <h1>Design Your Dream Holiday</h1>

                        <p>
                            Tell us where and when,
                            and let AI craft your perfect holiday experience.
                        </p>

                    </div>

                    <form
                        className="planner-form"
                        onSubmit={generateHolidayPlan}
                    >

                        {/* DESTINATION */}
                        <div className="form-group full-width">

                            <label>Where do you want to go?</label>

                            <div className="input-wrapper destination-box">

                                <FaMapMarkerAlt className="input-icon" />

                                <input
                                    type="text"
                                    placeholder="e.g. Bali, Indonesia"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                />

                            </div>

                        </div>

                        {/* DATES */}
                        <div className="planner-row">

                            <div className="form-group">

                                <label>Start Date</label>

                                <div className="input-wrapper">

                                    <FaCalendarAlt className="input-icon" />

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>End Date</label>

                                <div className="input-wrapper">

                                    <FaCalendarAlt className="input-icon" />

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        {/* TRAVELERS + BUDGET */}
                        <div className="planner-row">

                            <div className="form-group">

                                <label>Travelers</label>

                                <div className="input-wrapper">

                                    <FaUserFriends className="input-icon" />

                                    <input
                                        type="number"
                                        min="1"
                                        value={travelers}
                                        onChange={(e) => setTravelers(e.target.value)}
                                        required
                                    />

                                </div>
                            </div>

                            <div className="form-group">

                                <label>Budget (₹)</label>

                                <div className="input-wrapper">

                                    <FaWallet className="input-icon" />

                                    <input
                                        type="number"
                                        min="0"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="form-footer">

                            <button
                                type="submit"
                                className={`planner-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >

                                {loading ? (
                                    <FaSpinner className="spin-icon" />
                                ) : (
                                    <FaMagic className="btn-icon" />
                                )}

                                {loading
                                    ? 'Generating AI Holiday Plan...'
                                    : 'Generate AI Holiday Plan'
                                }

                            </button>

                            <p className="secure-note">
                                ✨ Powered by advanced AI planning
                            </p>

                        </div>

                    </form>

                </div>

                {/* RIGHT SIDE */}
                <div className="planner-right-side preview-section">

                    <h3>AI Generated Holiday Plan</h3>

                    <p className="preview-subtitle">
                        Preview your personalized AI holiday experience.
                    </p>

                    <div className="live-preview-box">

                        {loading ? (

                            <div className="preview-loading">

                                <FaSpinner className="spin-icon" />

                                <span>
                                    AI is creating your holiday plan...
                                </span>

                            </div>

                        ) : generatedPlan ? (

                            <div className="generated-plan-preview">

                                <div className="generated-plan-markdown">

                                    <ReactMarkdown>
                                        {generatedPlan.day_plan}
                                    </ReactMarkdown>

                                </div>

                                <button
                                    className="save-plan-btn"
                                    onClick={saveHolidayPlan}
                                >

                                    <FaCheckCircle />

                                    Save Holiday Plan

                                </button>

                            </div>

                        ) : (

                            <div className="preview-empty">

                                <FaMagic className="empty-icon" />

                                <p>
                                    Fill your holiday details and generate your AI plan.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AIPlanner