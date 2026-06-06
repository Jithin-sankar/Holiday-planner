import { useEffect, useState } from 'react';
import API from '../../api/api';
import './Navbar.css';

import {
    FaBell,
    FaUserCircle
} from 'react-icons/fa';

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get('accounts/profile/');
                setUser(response.data);
            } catch (error) {
                console.log("Failed to fetch user profile:", error);
            }
        };

        fetchUser();
    }, []);

    const getProfileImage = () => {
        if (!user?.profile_image) return null;

        // ✨ Cloudinary returns a full HTTPS URL. This safely catches it!
        if (user.profile_image.startsWith('http') || user.profile_image.startsWith('https')) {
            return user.profile_image;
        }

        // Fallback for any old local images
        return API.getMediaUrl(user.profile_image);
    };

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

                <div className="profile-box">
                    {getProfileImage() ? (
                        <img
                            src={getProfileImage()}
                            alt="profile"
                            className="profile-image"
                        />
                    ) : (
                        <div className="default-profile-icon">
                            <FaUserCircle size={38} color="#9CA3AF" />
                        </div>
                    )}

                    <div className="profile-info">
                        <h4>
                            {user?.full_name || 'Traveler'}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;