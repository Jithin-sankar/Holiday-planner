import './HolidayDetails.css'

import {

    FaMapMarkerAlt,
    FaCalendarAlt,
    FaStar,
    FaPlane,
    FaHotel,
    FaUtensils,
    FaArrowLeft

} from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'


function HolidayDetails() {

    const navigate = useNavigate()


    return (

        <div className="holiday-details-page">


            {/* BACK BUTTON */}

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >

                <FaArrowLeft />

                Back

            </button>



            {/* HERO SECTION */}

            <div className="details-hero">

                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    alt="holiday"
                />


                <div className="hero-overlay">

                    <h1>

                        Goa Beach Paradise

                    </h1>

                    <p>

                        Premium tropical holiday
                        experience with luxury stays
                        and beach adventures.

                    </p>

                </div>

            </div>



            {/* MAIN CONTENT */}

            <div className="details-grid">


                {/* LEFT */}

                <div className="details-left">


                    {/* INFO CARD */}

                    <div className="details-card">

                        <h2>

                            Holiday Information

                        </h2>


                        <div className="info-list">

                            <p>

                                <FaMapMarkerAlt />

                                Goa, India

                            </p>

                            <p>

                                <FaCalendarAlt />

                                5 Days / 4 Nights

                            </p>

                            <p>

                                <FaStar />

                                4.8 Rating

                            </p>

                        </div>


                        <p className="details-description">

                            Enjoy a luxury beach
                            vacation with premium
                            resorts, nightlife,
                            water sports, sunset cruises,
                            and local food experiences.

                        </p>

                    </div>



                    {/* ITINERARY */}

                    <div className="details-card">

                        <h2>

                            Travel Plan

                        </h2>


                        <div className="timeline">

                            <div className="timeline-item">

                                <span>Day 1</span>

                                <p>

                                    Arrival & beach walk

                                </p>

                            </div>

                            <div className="timeline-item">

                                <span>Day 2</span>

                                <p>

                                    Water sports & nightlife

                                </p>

                            </div>

                            <div className="timeline-item">

                                <span>Day 3</span>

                                <p>

                                    Island cruise & shopping

                                </p>

                            </div>

                            <div className="timeline-item">

                                <span>Day 4</span>

                                <p>

                                    Local food exploration

                                </p>

                            </div>

                        </div>

                    </div>

                </div>



                {/* RIGHT */}

                <div className="details-right">


                    {/* PRICE CARD */}

                    <div className="booking-card">

                        <h2>

                            ₹24,999

                        </h2>

                        <p>

                            Per Person

                        </p>


                        <div className="booking-features">

                            <div>

                                <FaPlane />

                                Flights Included

                            </div>

                            <div>

                                <FaHotel />

                                Luxury Hotel

                            </div>

                            <div>

                                <FaUtensils />

                                Free Breakfast

                            </div>

                        </div>


                        <button>

                            Book Holiday

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default HolidayDetails