import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✨ Imported useNavigate
import API from '../../api/api'
import './Stays.css'
import { 
    FaMapMarkerAlt, FaStar, FaWifi, 
    FaSwimmingPool, FaSearch, FaSpinner, FaHotel, FaArrowLeft 
} from 'react-icons/fa' // ✨ Added FaArrowLeft

function Stays() {
    const navigate = useNavigate() // ✨ Initialized navigate
    
    const [stays, setStays] = useState([])
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (destination.length < 3) return
        
        setLoading(true)
        try {
            const response = await API.get(`stay/?destination=${encodeURIComponent(destination)}`)
            setStays(response.data)
            setHasSearched(true)
        } catch (error) {
            console.error("Error fetching stays:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="stays-page">
            
           
            <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#64748b', 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        padding: '8px 0',
                        transition: 'color 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                >
                    <FaArrowLeft /> Back
                </button>
            </div>

            
            <div className="stays-header">
                <h1>Global Holiday Stays</h1>
                <p>Discover premium hotels, resorts, and luxury stays anywhere in the world.</p>
                
                <form className="stays-search-form" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <FaMapMarkerAlt className="search-icon" />
                        <input 
                            type="text" 
                            className="stays-search-input"
                            placeholder="Where are you going? (e.g. Paris, Bali)" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="stays-search-btn" disabled={loading}>
                        {loading ? <FaSpinner className="spin" /> : <FaSearch />}
                        Search Stays
                    </button>
                </form>
            </div>

            
            {loading && (
                <div className="stays-status-message loading-state">
                    <FaSpinner className="spin status-icon" /> 
                    <h2>Scanning Global Networks for "{destination}"...</h2>
                    <p>Finding the best live prices and availability.</p>
                </div>
            )}

            
            {!loading && hasSearched && stays.length === 0 && (
                <div className="stays-status-message empty-state">
                    <FaHotel className="status-icon" />
                    <h2>No stays found for "{destination}".</h2>
                    <p>Check your spelling or try searching for a different city.</p>
                </div>
            )}

            {/* STAYS GRID */}
            {!loading && stays.length > 0 && (
                <div className="stays-grid">
                    {stays.map((stay) => (
                        <div className="stay-card" key={stay.id}>
                            {/* IMAGE */}
                            <div className="stay-image">
                                <img src={stay.image} alt={stay.name} />
                                <div className="stay-price-badge">
                                    {stay.price} <span>/ night</span>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="stay-content">
                                <div className="stay-top">
                                    <h2 title={stay.name}>{stay.name}</h2>
                                </div>

                                <p className="stay-location">
                                    <FaMapMarkerAlt /> {stay.destination}
                                </p>

                                {/* FEATURES */}
                                <div className="stay-features">
                                    <span><FaWifi /> Free Wifi</span>
                                    <span><FaSwimmingPool /> Pool</span>
                                    <span className="rating-pill"><FaStar /> {stay.rating || '4.5'}</span>
                                </div>

                                {/* FOOTER */}
                                <div className="stay-footer">
                                    <button className="view-stay-btn">Book Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Stays