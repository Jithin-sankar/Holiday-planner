import './StatsCards.css'

import {

    FaUmbrellaBeach,
    FaWallet,
    FaRobot,
    FaCalendarCheck

} from 'react-icons/fa'


function StatsCards() {

    const stats = [

        {
            icon: <FaUmbrellaBeach />,
            title: 'Upcoming Holidays',
            value: '12',
            desc: 'Planned this year'
        },

        {
            icon: <FaCalendarCheck />,
            title: 'Bookings',
            value: '28',
            desc: 'Hotels & events'
        },

        {
            icon: <FaWallet />,
            title: 'Budget Left',
            value: '$4,250',
            desc: 'Available balance'
        },

        {
            icon: <FaRobot />,
            title: 'AI Suggestions',
            value: '18',
            desc: 'New recommendations'
        }

    ]


    return (

        <div className="stats-grid">

            {

                stats.map((item, index) => (

                    <div
                        className="stats-card"
                        key={index}
                    >

                        <div className="stats-icon">

                            {item.icon}

                        </div>

                        <div className="stats-content">

                            <h3>

                                {item.value}

                            </h3>

                            <h4>

                                {item.title}

                            </h4>

                            <p>

                                {item.desc}

                            </p>

                        </div>

                    </div>
                ))
            }

        </div>
    )
}

export default StatsCards