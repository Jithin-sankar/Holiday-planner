import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa'
import API from '../../api/api' 
import './Recommendations.css'

function Recommendations() {
    const navigate = useNavigate()
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)


    const fallbackPlaces = [
        {
            id: 'fallback-1',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            title: 'Maldives',
            location: 'Tropical Paradise',
            price: '₹85000',
            rating: '4.9'
        },
        {
            id: 'fallback-2',
            image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
            title: 'Switzerland',
            location: 'Mountain Escape',
            price: '₹120000',
            rating: '4.8'
        },
        {
            id: 'fallback-3',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
            title: 'Dubai',
            location: 'Luxury City',
            price: '₹65000',
            rating: '4.7'
        },
        {
            id: 'fallback-4',
            image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800&q=80',
            title: 'Bali',
            location: 'Island Adventure',
            price: '₹72000',
            rating: '4.9'
        }
    ]

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchRecommendations = async () => {
        try {
           
            const response = await API.get('trips/trips/')
            
            if (response.data && response.data.length > 0) {
                
                const mappedRealData = response.data.map((item, index) => ({
                    id: item.id,
                    
                    image: item.image || fallbackPlaces[index % fallbackPlaces.length].image,
                    
                    title: item.destination ? item.destination.split(',')[0].trim() : 'Unknown Place',
                    location: item.destination || 'Beautiful Destination',
                    price: item.budget ? `₹${item.budget.toLocaleString('en-IN')}` : 'Variable',
                    rating: item.rating || (4.5 + Math.random() * 0.5).toFixed(1) 
                }))

                
                setPlaces(mappedRealData.slice(0, 4))
            } else {
                setPlaces(fallbackPlaces)
            }
        } catch (error) {
            console.error("API not ready or failed, using fallback data:", error)
            setPlaces(fallbackPlaces)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="recommendations">
            <div className="recommendation-top">
                <div>
                    <h2> Your Holiday Trips</h2>
                    <p>Trending destinations planned by other travelers</p>
                </div>
                <button className="view-all-btn" onClick={() => navigate('/plan-trip')}>
                    Plan Yours
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#4f46e5' }}>
                    <FaSpinner className="spin" style={{ fontSize: '30px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '10px', color: '#64748b' }}>Curating recommendations...</p>
                </div>
            ) : (
                <div className="recommendation-grid">
                    {places.map((item) => (
                        <div className="recommendation-card" key={item.id}>
                            
                            <div className="rec-image-wrapper">
                                <img src={item.image} alt={item.title} />
                            </div>

                            <div className="recommendation-content">
                                <div className="recommendation-header">
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaMapMarkerAlt className="rec-icon" />
                                            {item.location.length > 20 ? item.location.substring(0, 20) + '...' : item.location}
                                        </p>
                                    </div>
                                    <span>
                                        <FaStar className="star-icon" color="#f59e0b" />
                                        {item.rating}
                                    </span>
                                </div>

                                <div className="recommendation-footer">
                                    <h4>{item.price} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>est. budget</span></h4>
                                    
                                    <button onClick={() => navigate(`/trip/${item.id}`)}>
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recommendations