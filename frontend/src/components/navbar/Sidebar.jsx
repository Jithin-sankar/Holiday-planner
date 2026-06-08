import './Sidebar.css'

import {

    FaHome,
    FaWallet,
    FaHotel,
    FaCalendarAlt,
    FaRobot,
    FaUserCircle,
    FaSuitcaseRolling

} from 'react-icons/fa'

import {

    useNavigate,
    useLocation

} from 'react-router-dom'


function Sidebar() {

    const navigate = useNavigate()

    const location = useLocation()


    const menuItems = [

        {
            name: 'Dashboard',

            icon:
            <FaHome className="menu-icon" />,

            path: '/dashboard'
        },

        {
            name: 'Stays',

            icon:
            <FaHotel className="menu-icon" />,

            path: '/stays'
        },

        {
            name: 'Events',

            icon:
            <FaCalendarAlt className="menu-icon" />,

            path: '/events'
        },

        {
            name: 'My Holiday',

            icon:
            <FaSuitcaseRolling className="menu-icon" />,

            path: '/my-trips'
        },

        {
            name: 'Budget',

            icon:
            <FaWallet className="menu-icon" />,

            path: '/budget'
        },

        {
            name: 'AI Planner',

            icon:
            <FaRobot className="menu-icon" />,

            path: '/ai-planner'
        },

        {
            name: 'Profile',

            icon:
            <FaUserCircle className="menu-icon" />,

            path: '/profile'
        }
    ]


    return (

        <div className="sidebar">


            

            <div className="sidebar-logo">

                <div className="logo-icon">

                    <FaRobot />

                </div>

                <div className="logo-text">

                    HolidayAI

                </div>

            </div>



            {/* MENU */}

            <ul className="sidebar-menu">

                {

                    menuItems.map((item, index) => (

                        <li

                            key={index}

                            className={
                                location.pathname === item.path
                                ? 'active'
                                : ''
                            }

                            onClick={() =>
                                navigate(item.path)
                            }
                        >

                            {item.icon}

                            <span className="menu-text">

                                {item.name}

                            </span>

                        </li>
                    ))
                }

            </ul>

        </div>
    )
}

export default Sidebar