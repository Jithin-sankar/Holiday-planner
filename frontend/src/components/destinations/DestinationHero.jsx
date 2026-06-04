import './DestinationHero.css'
import { FaRobot, FaTree, FaStar, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function DestinationHero({ itinerary, trip }) {
    const navigate = useNavigate();

    return (
        <div
            className="destination-hero"
            style={{
                backgroundImage: `url(${
                    trip?.image ||
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
                })`
            }}
        >
            <div className="hero-overlay">
                
                {/* NEW: Inner container to align content with your grid below */}
                <div className="hero-inner-align">
                    
                    {/* FLOATING BACK BUTTON */}
                    <button 
                        className="hero-back-icon-btn" 
                        onClick={() => navigate('/my-trips')}
                        title="Back to Trips"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="hero-content">
                        <span className="hero-tag">
                            AI Holiday Planner
                        </span>

                        <h1>
                            {trip?.destination || 'Your Destination'}
                        </h1>

                        <p>
                            {trip?.start_date}
                            {trip?.start_date && trip?.end_date ? ' • ' : ''}
                            {trip?.end_date}
                        </p>

                        <div className="hero-badges">
                            <span><FaRobot className="badge-icon" /> AI Powered</span>
                            <span><FaTree className="badge-icon" /> Smart Holiday</span>
                            <span><FaStar className="badge-icon" /> Personalized Plan</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DestinationHero