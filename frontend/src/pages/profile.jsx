import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import API from '../api/api'
import './Profile.css'

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapPin,
  FaSave,
  FaEdit,
  FaSignOutAlt,
  FaCheck,
  FaBriefcase,
  FaGlobe,
  FaStar,
  FaMapMarkerAlt,
  FaCamera,
} from 'react-icons/fa'


function Avatar({ user, onImageChange }) {
  const avatarSrc = user?.profile_image
    ? user.profile_image.startsWith('blob:')
      ? user.profile_image
      : `http://localhost:8000${user.profile_image}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.full_name || 'U'
      )}&backgroundColor=2563eb&textColor=ffffff`

  return (
    <div className="avatar-wrapper">
      <div className="avatar-img-ring">
        <img src={avatarSrc} alt="profile" />
      </div>

      <label className="avatar-camera-btn" title="Change photo">
        <FaCamera />
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onImageChange}
        />
      </label>
    </div>
  )
}

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>

      <span className="stat-card__value">{value}</span>

      <span className="stat-card__label">{label}</span>
    </div>
  )
}

function FormField({
  label,
  name,
  value,
  type = 'text',
  icon,
  editing,
  onChange,
}) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <div className="form-field__input-wrap">
        {icon && (
          <span
            className={`form-field__icon ${
              editing
                ? 'form-field__icon--active'
                : 'form-field__icon--muted'
            }`}
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={!editing}
          className={!icon ? 'no-icon' : ''}
        />
      </div>
    </div>
  )
}


export default function Profile() {
  const navigate = useNavigate()


  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
  })


  useEffect(() => {
    fetchAllData()
  }, [])


  const fetchAllData = async () => {
    try {
      const profileRes = await API.get('accounts/profile/')
      const profileData = profileRes.data

      setUser(profileData)

      setFormData({
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
      })

      const tripsRes = await API.get('trips/trips/')
      setTrips(tripsRes.data)

    } catch (err) {
      console.error(err)
      setError('Failed to load profile data.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const { data } = await API.put(
        'accounts/profile/',
        formData
      )

      setUser(data)
      setEditing(false)

      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 2500)

    } catch (err) {
      console.error(err)
      setError('Failed to save changes.')
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    setUser((prev) => ({
      ...prev,
      profile_image: URL.createObjectURL(file),
    }))

    const imageData = new FormData()
    imageData.append('profile_image', file)

    try {
      const { data } = await API.put(
        'accounts/profile/',
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setUser(data)

    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = async () => {
    try {
      await API.post('accounts/logout/')
      navigate('/login')

    } catch (err) {
      console.error(err)
    }
  }


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const firstName =
    user?.full_name?.split(' ')[0] || 'Traveler'

  const totalTrips = trips.length

  const uniqueDestinations = new Set(
    trips.map((trip) => trip.destination)
  ).size

  const recentTrips = [...trips]
    .reverse()
    .slice(0, 3)


  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading__spinner" />

        <p className="profile-loading__text">
          Loading your profile…
        </p>
      </div>
    )
  }


  return (
    <div className="profile-page">
      <div className="profile-layout">


        <aside className="profile-sidebar fade-up fade-up-1">

          <button
            className="dashboard-floating-btn"
            onClick={() => navigate('/dashboard')}
          >
            ←
          </button>

          <Avatar
            user={user}
            onImageChange={handleImageChange}
          />

          <div className="sidebar-info">
            <h2 className="sidebar-name">
              {user?.full_name || 'Traveler'}
            </h2>

            <p className="sidebar-role">
              AI Holiday Traveler
            </p>

            <div className="sidebar-tags">
              <span className="sidebar-tag">
                Explorer
              </span>

              <span className="sidebar-tag">
                Smart Planner
              </span>
            </div>
          </div>

          <div className="sidebar-contact">

            <div className="sidebar-contact-row">
              <FaEnvelope />
              <span>{user?.email}</span>
            </div>

            <div className="sidebar-contact-row">
              <FaPhone />
              <span>{user?.phone}</span>
            </div>

            <div className="sidebar-contact-row">
              <FaMapPin />
              <span>{user?.location}</span>
            </div>

          </div>

          <div className="sidebar-actions">

            {editing ? (
              <button
                className="btn btn-save"
                onClick={handleUpdateProfile}
              >
                <FaSave />
                Save Changes
              </button>
            ) : (
              <button
                className="btn btn-edit"
                onClick={() => setEditing(true)}
              >
                <FaEdit />
                Edit Profile
              </button>
            )}

            <button
              className="btn btn-logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        </aside>


        <main className="profile-content">

          {error && (
            <div
              className="profile-toast"
              style={{ background: '#dc2626' }}
            >
              {error}
            </div>
          )}

          {saved && (
            <div className="profile-toast">
              <FaCheck />
              Profile updated successfully!
            </div>
          )}


          <div className="profile-banner fade-up fade-up-2">

            <div className="profile-banner__blob1" />
            <div className="profile-banner__blob2" />

            <div className="profile-banner__content">

              <p className="profile-banner__eyebrow">
                My Profile
              </p>

              <h1 className="profile-banner__title">
                Welcome back, <em>{firstName}</em>
              </h1>

              <p className="profile-banner__sub">
                Manage your profile, update personal details,
                and personalize your AI travel planning
                experience.
              </p>

            </div>
          </div>

          

          <div className="stats-row fade-up fade-up-2">

            <StatCard
              icon={<FaBriefcase />}
              value={totalTrips}
              label="Total Trips"
            />

            <StatCard
              icon={<FaGlobe />}
              value={uniqueDestinations}
              label="Destinations"
            />

            <StatCard
              icon={<FaStar />}
              value={user?.rating ?? '4.9★'}
              label="Travel Rating"
            />

          </div>

        

          <div className="info-card fade-up fade-up-3">

            <div className="info-card__header">

              <div>
                <h3 className="info-card__title">
                  Personal Information
                </h3>

                <p className="info-card__sub">
                  {editing
                    ? "You're in edit mode — make your changes below."
                    : 'Click Edit Profile to update your details.'}
                </p>
              </div>

              {editing && (
                <span className="editing-badge">
                  EDITING
                </span>
              )}

            </div>

            <div className="profile-form-grid">

              <FormField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                editing={editing}
                onChange={handleChange}
                icon={<FaUser />}
              />

              <FormField
                label="Email Address"
                name="email"
                value={formData.email}
                type="email"
                editing={editing}
                onChange={handleChange}
                icon={<FaEnvelope />}
              />

              <FormField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                editing={editing}
                onChange={handleChange}
                icon={<FaPhone />}
              />

              <FormField
                label="Location"
                name="location"
                value={formData.location}
                editing={editing}
                onChange={handleChange}
                icon={<FaMapPin />}
              />

            </div>
          </div>

         

          {recentTrips.length > 0 && (
            <div className="activity-card fade-up fade-up-4">

              <h3 className="activity-card__title">
                Recent Activity
              </h3>

              <div className="activity-list">

                {recentTrips.map((trip, index) => {
                  const isCompleted =
                    trip.status === 'Completed'

                  const badgeColor = isCompleted
                    ? '#16a34a'
                    : '#2563eb'

                  return (
                    <div
                      key={trip.id}
                      className={`activity-row ${
                        index < recentTrips.length - 1
                          ? 'activity-row--bordered'
                          : ''
                      }`}
                    >

                      <div className="activity-row__left">

                        <div className="activity-row__icon">
                          <FaMapMarkerAlt />
                        </div>

                        <div>
                          <p className="activity-row__dest">
                            {trip.destination}
                          </p>

                          <p className="activity-row__date">
                            {trip.start_date}
                          </p>
                        </div>

                      </div>

                      <span
                        className="activity-badge"
                        style={{
                          background: `${badgeColor}18`,
                          color: badgeColor,
                        }}
                      >
                        {trip.status || 'Planned'}
                      </span>

                    </div>
                  )
                })}

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}