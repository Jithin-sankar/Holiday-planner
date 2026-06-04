import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/api'
import './Budget.css'
import {
    FaWallet,
    FaHotel,
    FaUtensils,
    FaPlane,
    FaTicketAlt,
    FaSpinner,
    FaArrowLeft,
    FaChartPie
} from 'react-icons/fa'

function Budget() {
    const navigate = useNavigate()
    const [totalBudget, setTotalBudget] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBudgets()
    }, [])

    const fetchBudgets = async () => {
        try {
            const response = await API.get('trips/trips/')
            const calculatedTotal = response.data.reduce((sum, trip) => {
                return sum + (parseFloat(trip.budget) || 0)
            }, 0)
            setTotalBudget(calculatedTotal)
        } catch (error) {
            console.error("Error fetching budget data:", error)
        } finally {
            setLoading(false)
        }
    }

    // Algorithmic breakdown with specific brand colors for the UI
    const expenses = [
        {
            title: 'Hotel & Stays',
            amount: totalBudget * 0.45,
            percent: 45,
            icon: <FaHotel />,
            color: '#3b82f6', // Blue
            bg: '#eff6ff'
        },
        {
            title: 'Food & Dining',
            amount: totalBudget * 0.25,
            percent: 25,
            icon: <FaUtensils />,
            color: '#f59e0b', // Amber
            bg: '#fffbeb'
        },
        {
            title: 'Transportation',
            amount: totalBudget * 0.20,
            percent: 20,
            icon: <FaPlane />,
            color: '#10b981', // Emerald
            bg: '#ecfdf5'
        },
        {
            title: 'Events & Tickets',
            amount: totalBudget * 0.10,
            percent: 10,
            icon: <FaTicketAlt />,
            color: '#8b5cf6', // Purple
            bg: '#f5f3ff'
        }
    ]

    const formatCurrency = (amount) => {
        return `₹${Math.round(amount).toLocaleString('en-IN')}`
    }

    if (loading) {
        return (
            <div className="budget-loading-screen">
                <FaSpinner className="spin loading-icon" />
                <h2>Analyzing your finances...</h2>
            </div>
        )
    }

    return (
        <div className="budget-page">
            
            <div className="budget-top-nav">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
            </div>

            {totalBudget === 0 ? (
                <div className="budget-empty-state">
                    <div className="empty-icon-wrapper">
                        <FaWallet />
                    </div>
                    <h2>No Budgets Found</h2>
                    <p>Create a trip in the AI Planner to see your financial breakdown here.</p>
                    <button onClick={() => navigate('/ai-planner')} className="empty-action-btn">
                        Plan a Trip
                    </button>
                </div>
            ) : (
                <div className="budget-dashboard-layout">
                    
                    {/* LEFT PANEL: Summary & Overview */}
                    <div className="budget-left-panel fade-up">
                        <div className="budget-header-block">
                            <h1>Holiday Finances</h1>
                            <p>Your AI-estimated expense breakdown across all planned adventures.</p>
                        </div>

                        <div className="premium-total-card">
                            <div className="card-top-row">
                                <span className="card-label">Total Estimated Budget</span>
                                <FaChartPie className="card-bg-icon" />
                            </div>
                            <h1 className="card-amount">{formatCurrency(totalBudget)}</h1>
                            
                            <div className="card-bottom-row">
                                <div className="usage-track">
                                    <div className="usage-fill" style={{ width: '75%' }}></div>
                                </div>
                                <span>75% Projected Usage</span>
                            </div>
                        </div>

                        <div className="budget-insight-box">
                            <h3><span role="img" aria-label="sparkle">✨</span> Smart Insight</h3>
                            <p>Based on your destinations, booking hotels 3 weeks in advance could save you up to 15% of your total budget.</p>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Detailed Breakdown */}
                    <div className="budget-right-panel fade-up" style={{ animationDelay: '0.1s' }}>
                        <div className="expense-list-container">
                            <h2 className="list-title">Category Breakdown</h2>
                            
                            <div className="expense-list">
                                {expenses.map((item, index) => (
                                    <div className="expense-list-item" key={index}>
                                        <div className="item-main-info">
                                            <div className="item-icon" style={{ color: item.color, background: item.bg }}>
                                                {item.icon}
                                            </div>
                                            <div className="item-text">
                                                <h3>{item.title}</h3>
                                                <p>{item.percent}% of total budget</p>
                                            </div>
                                            <div className="item-amount">
                                                {formatCurrency(item.amount)}
                                            </div>
                                        </div>
                                        
                                        {/* Mini progress bar for each category */}
                                        <div className="item-bar-track">
                                            <div 
                                                className="item-bar-fill" 
                                                style={{ width: `${item.percent}%`, background: item.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Budget