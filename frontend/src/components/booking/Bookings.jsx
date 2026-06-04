import './Bookings.css'

import {

    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle

} from 'react-icons/fa'


function Bookings() {

    const bookings = [

        {
            id: 1,

            title: 'Goa Beach Holiday',

            image:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',

            location: 'Goa, India',

            date: '18 Aug 2026',

            status: 'Confirmed',

            statusClass: 'confirmed',

            icon: <FaCheckCircle />
        },

        {
            id: 2,

            title: 'Dubai Luxury Stay',

            image:
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',

            location: 'Dubai, UAE',

            date: '12 Sep 2026',

            status: 'Pending',

            statusClass: 'pending',

            icon: <FaClock />
        },

        {
            id: 3,

            title: 'Kerala Nature Trip',

            image:
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',

            location: 'Kerala, India',

            date: '03 Oct 2026',

            status: 'Cancelled',

            statusClass: 'cancelled',

            icon: <FaTimesCircle />
        }

    ]


    return (

        <div className="bookings-page">


            {/* HEADER */}

            <div className="bookings-header">

                <h1>

                    Booking History

                </h1>

                <p>

                    Track your holiday bookings,
                    upcoming trips,
                    and booking status.

                </p>

            </div>



            {/* BOOKINGS GRID */}

            <div className="bookings-grid">

                {

                    bookings.map((booking) => (

                        <div
                            className="booking-card"
                            key={booking.id}
                        >


                            {/* IMAGE */}

                            <div className="booking-image">

                                <img
                                    src={booking.image}
                                    alt={booking.title}
                                />

                            </div>



                            {/* CONTENT */}

                            <div className="booking-content">


                                <div className={`booking-status ${booking.statusClass}`}>

                                    {booking.icon}

                                    {booking.status}

                                </div>



                                <h2>

                                    {booking.title}

                                </h2>



                                <div className="booking-info">

                                    <p>

                                        <FaMapMarkerAlt />

                                        {booking.location}

                                    </p>

                                    <p>

                                        <FaCalendarAlt />

                                        {booking.date}

                                    </p>

                                </div>



                                <div className="booking-buttons">

                                    <button className="details-btn">

                                        View Details

                                    </button>

                                    <button className="invoice-btn">

                                        Download Invoice

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

export default Bookings