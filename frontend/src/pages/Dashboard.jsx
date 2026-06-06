import './Dashboard.css'

import Sidebar from '../components/navbar/Sidebar'
import Navbar from '../components/navbar/Navbar'
import Showcase from '../components/Showcase/Showcase'
import Recommendations from '../components/recommendations/Recommendations'
import HolidaySection from '../components/Holidays/HolidaySection'
import Footer from '../components/footer/Footer'

function Dashboard() {
    return (
        
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard-main">
                <Navbar />
                <Showcase />
                <HolidaySection/>
                <Recommendations />
                <Footer/>
            </div>
        </div>
    )
}

export default Dashboard