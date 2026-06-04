import './BookingSection.css'

import {

    FaHotel,
    FaCheckCircle,
    FaClock,
    FaMapMarkerAlt

} from 'react-icons/fa'


function BookingSection() {

    const bookings = [

        {
            id: 1,
            title: 'Goa Beach Resort',
            status: 'Confirmed',
            days: '12 Aug - 16 Aug',
            location: 'Goa, India',
            icon: <FaCheckCircle />,
            statusClass: 'confirmed'
        },

        {
            id: 2,
            title: 'Dubai Festival Trip',
            status: 'Pending',
            days: '02 Sep - 08 Sep',
            location: 'Dubai, UAE',
            icon: <FaClock />,
            statusClass: 'pending'
        },

        {
            id: 3,
            title: 'Kerala Houseboat',
            status: 'Completed',
            days: '20 Jul - 24 Jul',
            location: 'Kerala, India',
            icon: <FaCheckCircle />,
            statusClass: 'completed'
        }

    ]


    return (

        <div className="booking-section">

            <div className="booking-header">

                <div>

                    <h2>

                        My Holiday Bookings

                    </h2>

                    <p>

                        Track your upcoming and completed holidays

                    </p>

                </div>

                <button>

                    View All

                </button>

            </div>


            <div className="booking-grid">

                {

                    bookings.map((item) => (

                        <div
                            className="booking-card"
                            key={item.id}
                        >

                            <div className="booking-top">

                                <div className="booking-icon">

                                    <FaHotel />

                                </div>

                                <div className={`booking-status ${item.statusClass}`}>

                                    {item.icon}

                                    {item.status}

                                </div>

                            </div>


                            <h3>

                                {item.title}

                            </h3>


                            <div className="booking-info">

                                <p>

                                    {item.days}

                                </p>

                                <p>

                                    <FaMapMarkerAlt />

                                    {item.location}

                                </p>

                            </div>


                            <button>

                                Manage Booking

                            </button>

                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default BookingSection