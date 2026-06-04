import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'leaflet/dist/leaflet.css'
function App() {
  return (
    <>
  <AppRoutes />
  <ToastContainer position="top-right" autoClose={3000} />
 </>
  )
}

export default App