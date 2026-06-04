
import './Services.css'

import {

    FaPlane,

    FaHotel,

    FaTrain,

    FaBus,

    FaMapMarkedAlt,

    FaUmbrellaBeach,

    FaCalendarAlt,

    FaRobot

} from 'react-icons/fa'


function Services() {

    const services = [

        {
            icon: <FaPlane />,
            title: 'Flights'
        },

        {
            icon: <FaHotel />,
            title: 'Hotels'
        },

        {
            icon: <FaUmbrellaBeach />,
            title: 'Holiday Trips'
        },

        {
            icon: <FaTrain />,
            title: 'Trains'
        },

        {
            icon: <FaBus />,
            title: 'Buses'
        },

        {
            icon: <FaMapMarkedAlt />,
            title: 'Destinations'
        },

        {
            icon: <FaCalendarAlt />,
            title: 'Events'
        },

        {
            icon: <FaRobot />,
            title: 'AI Planner'
        }
    ]

    return (

        <div className="services">

            {
                services.map((item, index) => (

                    <div
                        className="service-card"
                        key={index}
                    >

                        <div className="service-icon">

                            {item.icon}

                        </div>

                        <p>

                            {item.title}

                        </p>

                    </div>
                ))
            }

        </div>
    )
}

export default Services

