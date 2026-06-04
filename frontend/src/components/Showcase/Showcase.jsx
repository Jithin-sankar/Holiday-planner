import './Showcase.css'
import { useNavigate } from 'react-router-dom'
import {
    FaRobot,
    FaShieldAlt,
    FaHeadset,
    FaMagic
} from 'react-icons/fa'

function Showcase() {
    // 1. Initialize the navigate function
    const navigate = useNavigate()

    return (
        <div className="showcase-wrapper">

            <div className="showcase-left">

                <h1>
                    Plan
                    <span> Smarter.</span>
                    <br />
                    Holiday
                    <span> Better.</span>
                </h1>

                <p>
                    Your smart holiday planner for
                    destinations, stays, events and
                    personalized holiday experiences.
                </p>

                <div className="showcase-stats">
                    <div className="stat-box">
                        <h3>120+</h3>
                        <p>Holiday Spots</p>
                    </div>

                    <div className="stat-box">
                        <h3>4.9★</h3>
                        <p>User Reviews</p>
                    </div>

                    <div className="stat-box">
                        <h3>AI</h3>
                        <p>Smart Planning</p>
                    </div>
                </div>

                <div className="showcase-features">
                    <div className="feature-badge">
                        <FaMagic />
                        AI Holiday Planning
                    </div>

                    <div className="feature-badge">
                        <FaShieldAlt />
                        Secure Booking
                    </div>

                    <div className="feature-badge">
                        <FaHeadset />
                        24/7 Support
                    </div>
                </div>

            </div>

            <div className="showcase-right">

                <div className="ai-card">

                    <div className="ai-top">
                        <div>
                            <h3>
                                Your AI Holiday Assistant
                            </h3>

                            <p>
                                Get personalized holiday
                                itineraries and smart
                                recommendations.
                            </p>
                        </div>

                        <FaRobot className="robot-icon" />
                    </div>

                    
                    <button onClick={() => navigate('/ai-planner')}>
                        Try AI Planner →
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Showcase