import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/api'
import './navbar.css'

import {
    FaBell,
    FaChevronDown,
    FaUserCircle
} from 'react-icons/fa'

function Navbar() {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {

        try {

            const response = await API.get('accounts/profile/')

            setUser(response.data)

        } catch (error) {

            console.log(error)
        }
    }

    const getProfileImage = () => {

        if (!user?.profile_image) return null

        if (user.profile_image.startsWith('http')) {
            return user.profile_image
        }

        return `http://localhost:8000${user.profile_image}`
    }

    return (

        <div className="topbar">

            <div>

                <h2>
                    👋 Welcome back, {user?.full_name || 'Traveler'}
                </h2>

                <p>
                    Let’s plan your next holiday adventure
                </p>

            </div>

            <div className="topbar-right">



                <div className="top-icon notification-icon">
                    <FaBell />
                    <span className="notify-dot"></span>
                </div>

                <div
                    className="profile-box"
                   
                >
                    {
                        getProfileImage() ? (

                            <img
                                src={getProfileImage()}
                                alt="profile"
                                className="profile-image"
                            />

                        ) : (

                            <div className="default-profile-icon">
                                <FaUserCircle />
                            </div>
                        )
                    }

                    <div className="profile-info">

                        <h4>
                            {user?.full_name || 'Traveler'}
                        </h4>

                        
                    </div>
                   

                </div>

            </div>

        </div>
    )
}
export default Navbar