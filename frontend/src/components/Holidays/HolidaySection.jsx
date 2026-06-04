import './HolidaySection.css'

import {

    FaMapMarkerAlt,
    FaCalendarAlt,
    FaStar

} from 'react-icons/fa'


function HolidaySection() {

    const holidays = [

        {
            id: 1,
            title: 'Goa Summer Escape',
            location: 'Goa, India',
            days: '4 Days',
            rating: '4.9',
            image:
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2'
        },

        {
            id: 2,
            title: 'Kerala Backwater Retreat',
            location: 'Kerala, India',
            days: '6 Days',
            rating: '4.8',
            image:
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944'
        },

        {
            id: 3,
            title: 'Dubai Festival Holiday',
            location: 'Dubai, UAE',
            days: '5 Days',
            rating: '4.7',
            image:
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
        }

    ]


    return (

        <div className="holiday-section">

            <div className="section-header">

                <div>

                    <h2>

                        Upcoming Holidays

                    </h2>

                    <p>

                        Discover trending holiday destinations and experiences

                    </p>

                </div>

                <button>

                    View All

                </button>

            </div>


            <div className="holiday-grid">

                {

                    holidays.map((item) => (

                        <div
                            className="holiday-card"
                            key={item.id}
                        >

                            <img
                                src={item.image}
                                alt={item.title}
                            />

                            <div className="holiday-content">

                                <h3>

                                    {item.title}

                                </h3>

                                <div className="holiday-info">

                                    <p>

                                        <FaMapMarkerAlt />

                                        {item.location}

                                    </p>

                                    <p>

                                        <FaCalendarAlt />

                                        {item.days}

                                    </p>

                                </div>

                                <div className="holiday-footer">

                                    <div className="rating">

                                        <FaStar />

                                        {item.rating}

                                    </div>

                                    <button>

                                        Explore

                                    </button>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default HolidaySection