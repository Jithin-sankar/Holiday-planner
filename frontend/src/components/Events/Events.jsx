import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/api'
import './Events.css'
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaTicketAlt,
    FaSearch,
    FaSpinner,
    FaArrowLeft,
    FaClock
} from 'react-icons/fa'

function Events() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (destination.length < 3) return
        
        setLoading(true)
        try {
            const response = await API.get(`events/events/?destination=${encodeURIComponent(destination)}`)
            setEvents(response.data)
            setHasSearched(true)
        } catch (error) {
            console.error("Error fetching live events:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="events-page">

            <div className="events-top-nav">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
            </div>

            <div className="events-header fade-up">
                <h1>Live Holiday Events</h1>
                <p>Search real concerts, sports, and festivals happening at your destination.</p>

                <form className="events-search-form" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <FaMapMarkerAlt className="search-icon" />
                        <input 
                            type="text" 
                            className="events-search-input"
                            placeholder="Search by city (e.g. London, New York)" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="events-search-btn" disabled={loading}>
                        {loading ? <FaSpinner className="spin" /> : <FaSearch />}
                        Find Events
                    </button>
                </form>
            </div>

            {loading && (
                <div className="events-status-message loading-state">
                    <FaSpinner className="spin status-icon" /> 
                    <h2>Scanning Ticketmaster...</h2>
                    <p>Finding the hottest events for your dates.</p>
                </div>
            )}

            {!loading && hasSearched && events.length === 0 && (
                <div className="events-status-message empty-state">
                    <FaTicketAlt className="status-icon" />
                    <h2>No events found for "{destination}".</h2>
                    <p>Try searching for a larger neighboring city.</p>
                </div>
            )}

            {!loading && events.length > 0 && (
                <div className="events-grid">
                    {events.map((event, index) => (
                        <div className="event-card fade-up" style={{ animationDelay: `${index * 0.1}s` }} key={event.id}>
                            
                            <div className="event-image">
                                <img
                                    src={event.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'}
                                    alt={event.title}
                                />
                                <div className="event-category-badge">
                                    {event.category}
                                </div>
                            </div>

                            <div className="event-content">
                                <h2>{event.title}</h2>

                                <div className="event-info">
                                    <p><FaMapMarkerAlt className="info-icon" /> {event.location}</p>
                                    <p><FaCalendarAlt className="info-icon" /> {event.date}</p>
                                    <p><FaClock className="info-icon" /> {event.time}</p>
                                </div>

                                <div className="event-footer">
                                    <span className="event-price">{event.price}</span>
                                    <button className="book-btn">Get Tickets</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Events