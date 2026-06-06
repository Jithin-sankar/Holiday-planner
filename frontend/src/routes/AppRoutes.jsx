import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'

import Login from '../auth/Login'
import Register from '../auth/Register'
import ForgotPassword from '../auth/ForgotPassword'
import OTPVerification from '../auth/OTPVerification'

import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import MyTrips from '../components/Trip/MyTrips'
import TripDetails from '../components/Trip/TripDetails'
import AIPlanner from '../components/planner/AIPlanner'
import HolidayDetails from '../components/Holidays/HolidayDetails'
import Stays from '../components/Stays/Stays'
import Events from '../components/Events/Events'
import Destinations from '../components/destinations/Destinations'
import Bookings from '../components/booking/Bookings'
import Budget from '../components/Budget/Budget'

import AdminDashboard from '../admin/AdminDashboard'

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


               

                <Route path="/"element={<Login />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/verify-otp" element={<OTPVerification />}/>
                <Route path="/my-trips" element={<MyTrips />}/>
                <Route path="/trip-details" element={<TripDetails />}/>
                <Route path="/ai-planner" element={<AIPlanner />}/>
                <Route path="/budget" element={<Budget />}/>
                <Route path="/events" element={<Events />}/>
                <Route path="/stays" element={<Stays />}/>
                <Route path="/holiday-details" element={<HolidayDetails />}/>
                <Route path="/destinations" element={<Destinations />}/>
                <Route path="/trip/:id" element={<TripDetails />} />
                <Route path="/destinations/:id" element={<TripDetails />} />
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/bookings" element={<Bookings />}/>
                <Route path="/profile" element={<Profile />} />

                <Route path='/admin' element={<AdminDashboard/>}/>

            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes
