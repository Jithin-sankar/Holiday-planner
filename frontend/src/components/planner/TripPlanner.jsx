import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../api/api'
import './TripPlanner.css'

import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaWallet,
    FaRobot,
    FaLocationArrow,
    FaSpinner,
    FaHotel,
    FaCampground
} from 'react-icons/fa'

function TripPlanner() {
    const navigate = useNavigate()
    
    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        from_location: '',
        destination: '',
        departure: '',
        return_date: '',
        travelers: '1',
        budget: 'Standard'
    })
    const [loading, setLoading] = useState(false)

    // --- LIVE PREVIEW STATE ---
    const [liveStays, setLiveStays] = useState([])
    const [loadingStays, setLoadingStays] = useState(false)

    // --- THE LISTENER HOOK ---
    // This watches the destination input and fetches data when the user stops typing
    useEffect(() => {
        if (formData.destination.trim().length >= 3) {
            // Clean the input (e.g., "Goa, India" -> "Goa")
            const cleanCityName = formData.destination.split(',')[0].trim();
            
            // Debounce: Wait 500ms after typing stops before searching
            const delayDebounceFn = setTimeout(() => {
                fetchLiveStays(cleanCityName);
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setLiveStays([]); // Clear if input is too short or empty
        }
    }, [formData.destination]);

    const fetchLiveStays = async (city) => {
        try {
            setLoadingStays(true);
            const response = await API.get(`stay/?destination=${encodeURIComponent(city)}`);
            setLiveStays(response.data);
        } catch (err) {
            console.error("Live fetch failed", err);
        } finally {
            setLoadingStays(false);
        }
    };

    // --- HANDLERS ---
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.destination || !formData.departure) {
            toast.error("Please fill in the destination and departure date.")
            return;
        }

        try {
            setLoading(true)
            await API.post('trips/', formData)
            toast.success("Trip Generated Successfully!")
            
            // Redirect back to My Trips after creating
            navigate('/my-trips')

        } catch (err) {
            console.log(err)
            toast.error("Failed to generate trip. Try again!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="planner-page">
            <div className="trip-planner-container">
                
                {/* HEADER (Full Width) */}
                <div className="planner-header">
                    <button className="planner-back-btn" onClick={() => navigate('/my-trips')}>
                        ← Cancel
                    </button>
                    <div className="planner-title-group">
                        <div className="ai-badge"><FaRobot /> AI Powered</div>
                        <h2>Plan Your Next Holiday</h2>
                        <p>Tell us your preferences and let our AI build the perfect itinerary.</p>
                    </div>
                </div>

               
                <div className="planner-split-layout">
                    
                   
                    <div className="planner-left-side">
                        <div className="planner-form">
                            <div className="planner-row">
                                <div className="planner-input">
                                    <label>Starting From</label>
                                    <div className="input-box">
                                        <FaLocationArrow className="icon" />
                                        <input
                                            type="text"
                                            name="from_location"
                                            placeholder="e.g. Mumbai, India"
                                            value={formData.from_location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="planner-input">
                                    <label>Destination</label>
                                    <div className="input-box destination-box">
                                        <FaMapMarkerAlt className="icon" />
                                        <input
                                            type="text"
                                            name="destination"
                                            placeholder="Where do you want to go?"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: DATES */}
                            <div className="planner-row">
                                <div className="planner-input">
                                    <label>Departure Date</label>
                                    <div className="input-box">
                                        <FaCalendarAlt className="icon" />
                                        <input
                                            type="date"
                                            name="departure"
                                            value={formData.departure}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="planner-input">
                                    <label>Return Date</label>
                                    <div className="input-box">
                                        <FaCalendarAlt className="icon" />
                                        <input
                                            type="date"
                                            name="return_date"
                                            value={formData.return_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="planner-row">
                                <div className="planner-input">
                                    <label>Travelers</label>
                                    <div className="input-box">
                                        <FaUsers className="icon" />
                                        <select
                                            name="travelers"
                                            value={formData.travelers}
                                            onChange={handleChange}
                                        >
                                            <option value="1">1 Traveler (Solo)</option>
                                            <option value="2">2 Travelers (Couple)</option>
                                            <option value="3">3 Travelers</option>
                                            <option value="4">4 Travelers (Family)</option>
                                            <option value="5+">5+ Travelers (Group)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="planner-input">
                                    <label>Holiday Budget</label>
                                    <div className="input-box">
                                        <FaWallet className="icon" />
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                        >
                                            <option value="Budget Friendly">Budget Friendly</option>
                                            <option value="Standard">Standard</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Luxury">Luxury Resort</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                     
                        <div className="planner-footer">
                            <button
                                className={`generate-btn ${loading ? 'loading' : ''}`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                <FaRobot className="btn-icon" />
                                {loading ? "Our AI is crafting your trip..." : "Generate AI Itinerary"}
                            </button>
                            <p className="secure-text">✨ Uses advanced AI models to curate your perfect holiday</p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Live Previews */}
                    <div className="planner-right-side preview-section">
                        <h3>Destination Previews</h3>
                        <p className="preview-subtitle">Live accommodation check for your destination.</p>

                        <div className="live-preview-box">
                            {loadingStays ? (
                                <div className="preview-loading">
                                    <FaSpinner className="spin-icon" />
                                    <span>Scanning database...</span>
                                </div>
                            ) : liveStays.length > 0 ? (
                                <div className="preview-grid">
                                    {liveStays.map(stay => (
                                        <div key={stay.id} className="preview-card">
                                            <img src={stay.image} alt={stay.name} />
                                            <div className="preview-info">
                                                <h4>{stay.name}</h4>
                                                <p className="preview-price">{stay.price} <span>/ night</span></p>
                                                <span className={`preview-badge ${stay.stay_type}`}>
                                                    {stay.stay_type === 'camp' ? <FaCampground /> : <FaHotel />} {stay.stay_type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : formData.destination.length >= 3 ? (
                                <div className="preview-empty">
                                    <FaHotel className="empty-icon" />
                                    <p>No verified stays found for "{formData.destination}" yet.</p>
                                </div>
                            ) : (
                                <div className="preview-empty">
                                    <FaMapMarkerAlt className="empty-icon" />
                                    <p>Type a destination to see live hotel and camp previews!</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TripPlanner