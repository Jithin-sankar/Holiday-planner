import React from 'react';
import './Footer.css';
import { 
    FaInstagram, 
    FaTwitter, 
    FaFacebookF, 
    FaYoutube, 
    FaPaperPlane,
    FaGlobeAmericas,
    FaPhoneAlt,
    FaEnvelope,
    FaApple,
    FaGooglePlay,
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaCcStripe
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="planner-footer-wrapper">
            
            {/* TOP CTA BANNER */}
            <div className="footer-cta">
                <div className="cta-content">
                    <h2>Ready for your next holiday?</h2>
                    <p>Let our AI curate the perfect itinerary for your dream destination.</p>
                </div>
                <button className="cta-btn" onClick={() => navigate('/ai-planner')}>
                    Start Planning ✨
                </button>
            </div>

            {/* MAIN MEGA FOOTER */}
            <div className="footer-main">
                
                {/* COLUMN 1: BRAND, CONTACT & APPS */}
                <div className="footer-col brand-col">
                    <div className="footer-logo">
                        <FaGlobeAmericas className="logo-icon" />
                        <span>HolidayAI</span>
                    </div>
                    <p className="brand-desc">
                        The ultimate smart holiday planner. Discover, plan, and manage your trips with the power of artificial intelligence.
                    </p>
                    
                    <div className="contact-info">
                        <p><FaPhoneAlt className="contact-icon"/> +1 (800) 123-4567</p>
                        <p><FaEnvelope className="contact-icon"/> support@holidayai.com</p>
                    </div>

                    <div className="app-download-buttons">
                        <button className="app-btn">
                            <FaApple className="app-icon" />
                            <div className="app-btn-text">
                                <span>Download on the</span>
                                <strong>App Store</strong>
                            </div>
                        </button>
                        <button className="app-btn">
                            <FaGooglePlay className="app-icon" />
                            <div className="app-btn-text">
                                <span>GET IT ON</span>
                                <strong>Google Play</strong>
                            </div>
                        </button>
                    </div>
                </div>

                {/* COLUMN 2: TOP DESTINATIONS */}
                <div className="footer-col">
                    <h3>Top Destinations</h3>
                    <ul>
                        <li><a href="#goa">Goa, India</a></li>
                        <li><a href="#bali">Bali, Indonesia</a></li>
                        <li><a href="#maldives">Maldives Retreats</a></li>
                        <li><a href="#dubai">Dubai, UAE</a></li>
                        <li><a href="#swiss">Swiss Alps</a></li>
                        <li><a href="#paris">Paris, France</a></li>
                    </ul>
                </div>

                {/* COLUMN 3: TRAVEL STYLES */}
                <div className="footer-col">
                    <h3>Travel Styles</h3>
                    <ul>
                        <li><a href="#beach">Beach Holidays</a></li>
                        <li><a href="#mountain">Mountain Treks</a></li>
                        <li><a href="#luxury">Luxury Resorts</a></li>
                        <li><a href="#family">Family Vacations</a></li>
                        <li><a href="#solo">Solo Backpacking</a></li>
                        <li><a href="#ai">AI Curated Tours</a></li>
                    </ul>
                </div>

                {/* COLUMN 4: COMPANY & SUPPORT */}
                <div className="footer-col">
                    <h3>Support & Legal</h3>
                    <ul>
                        <li><a href="#help">Help Center</a></li>
                        <li><a href="#cancellation">Cancellation Policy</a></li>
                        <li><a href="#faq">FAQs</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#trust">Trust & Safety</a></li>
                    </ul>
                </div>

            </div>

            {/* BOTTOM UTILITY & COPYRIGHT BAR */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    
                    {/* LEFT: Copyright & Settings */}
                    <div className="footer-left-utils">
                        <p>&copy; {new Date().getFullYear()} HolidayAI Inc.</p>
                        <div className="locale-selectors">
                            <select className="footer-select">
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>Hindi</option>
                            </select>
                            <select className="footer-select">
                                <option>INR (₹)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* CENTER: Payment Methods */}
                    <div className="footer-payments">
                        <FaCcVisa title="Visa" />
                        <FaCcMastercard title="Mastercard" />
                        <FaCcPaypal title="PayPal" />
                        <FaCcStripe title="Stripe" />
                    </div>

                    {/* RIGHT: Social Media */}
                    <div className="footer-socials">
                        <a href="#twitter" className="social-icon"><FaTwitter /></a>
                        <a href="#instagram" className="social-icon"><FaInstagram /></a>
                        <a href="#facebook" className="social-icon"><FaFacebookF /></a>
                        <a href="#youtube" className="social-icon"><FaYoutube /></a>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;