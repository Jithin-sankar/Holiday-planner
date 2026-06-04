import './Dashboard.css'

import Sidebar from '../components/navbar/Sidebar'
import Navbar from '../components/navbar/Navbar'
import StatsCards from '../components/dashboard/StatsCards'
import Showcase from '../components/showcase/Showcase'
import Services from '../components/services/Services'
import TripPlanner from '../components/planner/TripPlanner'
import AIPlanner from '../components/planner/AIPlanner'
import Recommendations from '../components/recommendations/Recommendations'
import HolidaySection from '../components/holidays/HolidaySection'
import Footer from '../components/footer/Footer'

function Dashboard() {

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-main">

                <Navbar />

                {/* <StatsCards /> */} 
                <Showcase />
                <HolidaySection/>
                
                {/* <BookingSection/> */}
               
                {/* <Services /> */}

               
                {/* <TripPlanner /> */}

               
                <Recommendations />
                <Footer/>
            </div>

        </div>
    )
}

export default Dashboard