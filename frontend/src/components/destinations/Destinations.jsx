import './Destinations.css'
import { FaMapMarkerAlt, FaStar, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom' // 1. Import useNavigate

function Destinations() {
    const navigate = useNavigate(); // 2. Initialize navigate

    const destinations = [
        {
            id: 1,
            title: 'Goa Beach Escape',
            // Added ?auto=format to ensure reliable loading
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            location: 'Goa, India',
            rating: '4.8',
            budget: '₹25,000'
        },
        {
            id: 2,
            title: 'Dubai Luxury Tour',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
            location: 'Dubai, UAE',
            rating: '4.9',
            budget: '₹85,000'
        },
        {
            id: 3,
            title: 'Kerala Nature Retreat',
            image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
            location: 'Kerala, India',
            rating: '4.7',
            budget: '₹18,000'
        }
    ]

    return (
        <div className="destinations-page">
            {/* HEADER */}
            <div className="destinations-header">
                <h1>Recommended Destinations</h1>
                <p>
                    Explore trending holiday destinations selected for your next trip.
                </p>
            </div>

            {/* GRID */}
            <div className="destinations-grid">
                {destinations.map((place) => (
                    <div className="destination-card" key={place.id}>
                        
                        {/* IMAGE */}
                        <div className="destination-image">
                            <img src={place.image} alt={place.title} />
                        </div>

                        {/* CONTENT */}
                        <div className="destination-content">
                            <div className="destination-top">
                                <h2>{place.title}</h2>
                                <div className="destination-rating">
                                    <FaStar /> {place.rating}
                                </div>
                            </div>

                            <p className="destination-location">
                                <FaMapMarkerAlt /> {place.location}
                            </p>

                            <div className="destination-footer">
                                <div>
                                    <span>Starting From</span>
                                    <h3>{place.budget}</h3>
                                </div>
                                
                                {/* 3. Connect the Explore Button */}
                                <button onClick={() => navigate(`/destinations/${place.id}`)}>
                                    Explore <FaArrowRight />
                                </button>
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Destinations