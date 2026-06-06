import './TripDetails.css'
import DestinationHero from '../destinations/DestinationHero'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaWallet,
    FaMagic,
    FaSpinner,
    FaHotel,
    FaCampground
} from 'react-icons/fa'

import API from '../../api/api'

function TripDetails() {

    const { id } = useParams()

    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)

    const [itinerary, setItinerary] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)

    const [stays, setStays] = useState([])
    const [staysLoading, setStaysLoading] = useState(false)

    // ================= FETCH TRIP =================
    useEffect(() => {
        let isActive = true

        const fetchStays = async (city) => {
            try {
                setStaysLoading(true)

                const res = await API.get(
                    `stay/?destination=${encodeURIComponent(city)}`
                )

                if (isActive) {
                    setStays(res.data)
                }

            } catch (err) {
                console.error('Stays error:', err)
            } finally {
                if (isActive) {
                    setStaysLoading(false)
                }
            }
        }

        const fetchTrip = async () => {
            try {
                const res = await API.get(`trips/trips/${id}/`)

                if (!isActive) {
                    return
                }

                setTrip(res.data)

                // FIX: correct itinerary binding
                if (res.data.itinerary) {
                    setItinerary(res.data.itinerary)
                }

                const city = (res.data.destination || '').split(',')[0].trim()
                fetchStays(city)

            } catch (err) {
                console.error('Trip load error:', err)
            } finally {
                if (isActive) {
                    setLoading(false)
                }
            }
        }

        fetchTrip()

        return () => {
            isActive = false
        }
    }, [id])

    // ================= GENERATE AI =================
    const generateItinerary = async () => {
        try {
            setAiLoading(true)

            const res = await API.post(
                `itinerary/generate/${id}/`
            )

            setItinerary(res.data) // FIXED (no .data.data)

        } catch (err) {
            console.error('AI error:', err)
        } finally {
            setAiLoading(false)
        }
    }

 
    if (loading) {
        return (
            <div className="tripdetails-loading">
                <FaSpinner className="spin-icon" />
                <h2>Loading your holiday...</h2>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="tripdetails-loading">
                Trip not found.
            </div>
        )
    }

    return (
        <div className="tripdetails-page">

           
            <DestinationHero
                trip={trip}
                itinerary={itinerary}
            />

            <div className="tripdetails-container">

              
                <div className="tripdetails-grid">

                    <div className="tripdetails-card">
                        <FaMapMarkerAlt />
                        <div>
                            <h3>Destination</h3>
                            <p>{trip.destination}</p>
                        </div>
                    </div>

                    <div className="tripdetails-card">
                        <FaCalendarAlt />
                        <div>
                            <h3>Dates</h3>
                            <p>{trip.start_date} → {trip.end_date}</p>
                        </div>
                    </div>

                    <div className="tripdetails-card">
                        <FaUsers />
                        <div>
                            <h3>Travelers</h3>
                            <p>{trip.travelers}</p>
                        </div>
                    </div>

                    <div className="tripdetails-card">
                        <FaWallet />
                        <div>
                            <h3>Budget</h3>
                            <p>₹{trip.budget}</p>
                        </div>
                    </div>

                </div>

               
                <div className="tripdetails-split-layout">

                    
                    <div className="trip-main-content">

                        <div className="trip-ai-box">

                            <div className="ai-box-header">

                                <div>
                                    <h2>AI Holiday Plan</h2>
                                    <p>Personalized itinerary</p>
                                </div>

                                <button
                                    className="generate-ai-btn"
                                    onClick={generateItinerary}
                                    disabled={aiLoading}
                                >
                                    {aiLoading ? <FaSpinner className="spin-icon" /> : <FaMagic />}
                                    {itinerary ? 'Regenerate' : 'Generate'}
                                </button>

                            </div>

                            {itinerary ? (
                                <div className="generated-itinerary">

                                    <h2>{itinerary.title}</h2>

                                    <p>{itinerary.summary}</p>

                                    <ReactMarkdown>
                                        {itinerary.day_plan}
                                    </ReactMarkdown>

                                </div>
                            ) : (
                                <div className="ai-placeholder-content">
                                    <FaMagic />
                                    <h3>Generate your holiday plan</h3>
                                </div>
                            )}

                        </div>


                        <div className="recommended-stays-section">

                            <h2>Recommended Stays</h2>

                            <p>Hotels & camps near your destination</p>

                            {staysLoading ? (
                                <div className="stays-loading">
                                    <FaSpinner className="spin-icon" />
                                    Loading stays...
                                </div>
                            ) : (
                                <div className="recommended-stays-grid">

                                    {stays.length > 0 ? (
                                        stays.map(stay => (
                                            <div key={stay.id} className="stay-card">

                                                <img src={stay.image} alt={stay.name} />

                                                <div>
                                                    <h4>{stay.name}</h4>

                                                    <p>
                                                        {stay.stay_type === 'camp'
                                                            ? <FaCampground />
                                                            : <FaHotel />
                                                        }
                                                        {stay.stay_type}
                                                    </p>

                                                    <span>
                                                        ₹{stay.price}/night
                                                    </span>
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p>No stays found</p>
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default TripDetails
