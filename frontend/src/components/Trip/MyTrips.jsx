import './MyTrips.css'
import { FaMapMarkerAlt, FaCalendarAlt, FaEye, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/api'

function MyTrips() {
    const navigate = useNavigate()
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTrips()
    }, [])

    const fetchTrips = async () => {
        try {
            const response = await API.get('trips/trips/')
            setTrips(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteTrip = async (id) => {
        try {
            await API.delete(`trips/trips/${id}/`)
            setTrips(trips.filter((trip) => trip.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="mytrips-page">
                <div className="mytrips-container">
                    <div className="skeleton-header"></div>
                    <div className="mytrips-list">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="trip-row skeleton-row">
                                <div className="skeleton skeleton-img-sm"></div>
                                <div className="skeleton-details">
                                    <div className="skeleton skeleton-title-sm"></div>
                                    <div className="skeleton skeleton-text-sm"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mytrips-page">
            <div className="mytrips-container">


                <div className="mytrips-top-actions">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <button className="create-trip-btn" onClick={() => navigate('/ai-planner')}>
                        + New Trip
                    </button>
                </div>


                <div className="mytrips-title">
                    <h1>My Holiday Trips</h1>
                    <p>Manage your upcoming adventures and bookings.</p>
                </div>

                {/* EMPTY STATE */}
                {trips.length === 0 && (
                    <div className="empty-trips">
                        <p>No trips planned yet. Time to explore!</p>
                    </div>
                )}

                <div className="mytrips-list">
                    {trips.map((trip) => (
                        <div className="trip-row" key={trip.id}>

                            <img
                                src={trip.image}
                                alt={trip.destination}
                                className="trip-row-img"
                            />

                            <div className="trip-row-details">
                                <div className="trip-row-header">
                                    <h2>{trip.destination}</h2>
                                    <span className={`status-dot ${trip.status.toLowerCase()}`}>
                                        {trip.status}
                                    </span>
                                </div>

                                <div className="trip-row-meta">
                                    <span><FaMapMarkerAlt /> {trip.destination}</span>
                                    <span><FaCalendarAlt /> {trip.start_date}</span>
                                    <span className="budget-tag">₹{trip.budget}</span>
                                </div>
                            </div>

                            <div className="trip-row-actions">
                                <button
                                    className="icon-btn view"
                                    onClick={() => navigate(`/trip/${trip.id}`)}
                                    title="View Details"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="icon-btn delete"
                                    onClick={() => deleteTrip(trip.id)}
                                    title="Delete Trip"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyTrips