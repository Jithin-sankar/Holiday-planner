
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './AdminDashboard.css';

import {
    FaUsers, FaSuitcaseRolling, FaChartLine, FaSpinner,
    FaSignOutAlt, FaLayerGroup, FaSearch, FaLock,
    FaLockOpen, FaTrash, FaExclamationTriangle, FaEye, FaCalendarAlt
} from 'react-icons/fa';

function AdminDashboard() {
    const navigate = useNavigate();
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    const [notification, setNotification] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await API.get('core-admin/stats/');
            setAdminStats(response.data);
        } catch (err) {
            setError("Access Denied. You do not have administrator privileges.");
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type = 'success') => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        try {
            const response = await API.patch(`core-admin/toggle-block/${userId}/`);
            setAdminStats(prev => ({
                ...prev,
                user_list: prev.user_list.map(user =>
                    user.id === userId ? { ...user, is_active: response.data.is_active } : user
                )
            }));
            showMessage(`User successfully ${currentStatus ? 'blocked' : 'unblocked'}.`);


            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(prev => ({ ...prev, is_active: response.data.is_active }));
            }
        } catch (error) {
            showMessage("Failed to update user status.", "error");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await API.delete(`core-admin/delete-user/${userId}/`);
            setAdminStats(prev => ({
                ...prev,
                total_users: prev.total_users - 1,
                user_list: prev.user_list.filter(user => user.id !== userId)
            }));
            showMessage("User permanently deleted.");
            setIsUserModalOpen(false);
        } catch (error) {
            showMessage("Failed to delete user.", "error");
        }
    };

    const handleDeleteTrip = async (tripId) => {
        try {
            const response = await API.delete(`core-admin/delete-trip/${tripId}/`);
            setAdminStats(prev => ({
                ...prev,
                total_trips: prev.total_trips - 1,
                total_platform_value: prev.total_platform_value - response.data.deducted_budget,
                recent_activity: prev.recent_activity.filter(trip => trip.id !== tripId)
            }));
            showMessage("Trip permanently deleted.");
        } catch (error) {
            showMessage("Failed to delete trip.", "error");
        }
    };

    const confirmDelete = (id, type) => {
        setConfirmModal({
            isOpen: true,
            title: `Delete ${type}?`,
            message: `This will permanently delete the ${type.toLowerCase()}. This action cannot be undone.`,
            onConfirm: () => {
                type === 'User' ? handleDeleteUser(id) : handleDeleteTrip(id);
                setConfirmModal({ isOpen: false });
            }
        });
    };

    const confirmToggleBlock = (userId, currentStatus) => {
        const action = currentStatus ? "Block" : "Unblock";
        setConfirmModal({
            isOpen: true,
            title: `${action} User?`,
            message: `Are you sure you want to ${action.toLowerCase()} this user's access to the platform?`,
            onConfirm: () => {
                handleToggleBlock(userId, currentStatus);
                setConfirmModal({ isOpen: false });
            }
        });
    };

    const openUserDetails = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleLogout = async () => {
        try {
            await API.post('accounts/logout/');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;
    };

    const filteredTrips = adminStats?.recent_activity?.filter(trip =>
        trip?.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip?.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = adminStats?.user_list?.filter(user =>
        user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const activeUsersCount = adminStats?.user_list?.filter(u => u.is_active).length || 0;
    const blockedUsersCount = adminStats?.user_list?.filter(u => !u.is_active).length || 0;

    const userTrips = selectedUser
        ? adminStats?.recent_activity?.filter(trip => trip.user === selectedUser.email)
        : [];

    return (
        <div className="dashboard" style={{ position: 'relative' }}>


            {notification && (
                <div style={{
                    position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                    background: notification.type === 'success' ? '#10B981' : '#EF4444',
                    color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {notification.type === 'error' && <FaExclamationTriangle />}
                    {notification.text}
                </div>
            )}


            {confirmModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '8px' }}>{confirmModal.title}</h3>
                        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setConfirmModal({ isOpen: false })}
                                style={{ padding: '8px 16px', border: '1px solid #D1D5DB', background: '#fff', color: '#374151', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                style={{ padding: '8px 16px', border: 'none', background: '#4F46E5', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isUserModalOpen && selectedUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '20px', marginBottom: '20px' }}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${selectedUser.full_name}&background=4F46E5&color=fff&size=64`}
                                alt={selectedUser.full_name}
                                style={{ borderRadius: '50%' }}
                            />
                            <div>
                                <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>{selectedUser.full_name}</h2>
                                <span style={{ display: 'inline-block', marginTop: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', background: selectedUser.is_active ? '#D1FAE5' : '#FEE2E2', color: selectedUser.is_active ? '#059669' : '#DC2626' }}>
                                    {selectedUser.is_active ? 'Active Account' : 'Blocked Account'}
                                </span>
                            </div>
                        </div>


                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', color: '#374151', fontSize: '14px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
                                <span style={{ color: '#6B7280', fontWeight: '500' }}>Email Address</span>
                                <strong>{selectedUser.email}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
                                <span style={{ color: '#6B7280', fontWeight: '500' }}>Phone Number</span>
                                <strong>{selectedUser.phone || 'Not Provided'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
                                <span style={{ color: '#6B7280', fontWeight: '500' }}>User ID</span>
                                <strong style={{ fontFamily: 'monospace' }}>#{selectedUser.id}</strong>
                            </div>
                        </div>

                        {/* User Trip History Section */}
                        <div>
                            <h3 style={{ fontSize: '16px', color: '#111827', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                                <FaSuitcaseRolling style={{ marginRight: '6px', color: '#4F46E5' }} />
                                Trip History ({userTrips.length})
                            </h3>

                            {userTrips.length === 0 ? (
                                <p style={{ color: '#6B7280', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                                    This user has not planned any trips yet.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {userTrips.map(trip => (
                                        <div key={trip.id} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <strong style={{ fontSize: '15px', color: '#111827' }}>{trip.destination}</strong>
                                                <span className={`tag ${trip.status === 'completed' ? 'tag-completed' : 'tag-planned'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                                                    {trip.status || 'Planned'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaCalendarAlt /> {trip.start_date || 'N/A'} — {trip.end_date || 'N/A'}
                                                </span>
                                                <strong style={{ color: '#4F46E5' }}>{formatCurrency(trip.budget)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                            <button
                                onClick={() => setIsUserModalOpen(false)}
                                style={{ flex: 1, padding: '12px', border: 'none', background: '#F3F4F6', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: '0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#F3F4F6'}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { setIsUserModalOpen(false); confirmToggleBlock(selectedUser.id, selectedUser.is_active); }}
                                style={{ flex: 1, padding: '12px', border: `1px solid ${selectedUser.is_active ? '#FECACA' : '#A7F3D0'}`, background: selectedUser.is_active ? '#FEF2F2' : '#ECFDF5', color: selectedUser.is_active ? '#DC2626' : '#059669', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: '0.2s' }}
                            >
                                {selectedUser.is_active ? 'Block User' : 'Unblock User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-main">
                <header className="admin-header">
                    <div className="header-left">
                        <h1><FaLayerGroup style={{ color: '#4F46E5' }} /> System Overview</h1>
                        <p>Manage platform activity, users, and global metrics.</p>
                    </div>

                    <div className="header-right">
                        <button className="btn-logout-minimal" onClick={handleLogout}>
                            <FaSignOutAlt /> Sign Out
                        </button>
                        <img
                            src="https://ui-avatars.com/api/?name=AD&background=F3F4F6&color=111827"
                            alt="Admin"
                            className="admin-avatar"
                        />
                    </div>
                </header>

                <main className="admin-content">
                    {loading ? (
                        <div className="loader-wrapper"><FaSpinner className="spin-anim" /></div>
                    ) : error ? (
                        <div className="alert-error">⛔ {error}</div>
                    ) : (
                        <>
                            <section className="metrics-panel">
                                <div className="metric-block">
                                    <div className="metric-header"><div className="metric-icon"><FaUsers /></div><span>Total Users</span></div>
                                    <div className="metric-value">{adminStats?.total_users || 0}</div>

                                    <div style={{ fontSize: '12px', fontWeight: '500', marginTop: '6px' }}>
                                        <span style={{ color: '#059669' }}>{activeUsersCount} Active</span>
                                        <span style={{ color: '#D1D5DB', margin: '0 6px' }}>|</span>
                                        <span style={{ color: '#DC2626' }}>{blockedUsersCount} Blocked</span>
                                    </div>
                                </div>
                                <div className="metric-block">
                                    <div className="metric-header"><div className="metric-icon"><FaSuitcaseRolling /></div><span>Global Trips</span></div>
                                    <div className="metric-value">{adminStats?.total_trips || 0}</div>
                                </div>
                                <div className="metric-block">
                                    <div className="metric-header"><div className="metric-icon"><FaChartLine /></div><span>Economy Value</span></div>
                                    <div className="metric-value">{formatCurrency(adminStats?.total_platform_value)}</div>
                                </div>
                            </section>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        style={{ padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', background: activeTab === 'users' ? '#4F46E5' : 'transparent', color: activeTab === 'users' ? '#FFF' : '#6B7280', transition: '0.2s' }}
                                    >
                                        User Management
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('trips')}
                                        style={{ padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', background: activeTab === 'trips' ? '#4F46E5' : 'transparent', color: activeTab === 'trips' ? '#FFF' : '#6B7280', transition: '0.2s' }}
                                    >
                                        Trip Activity
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '10px 16px', borderRadius: '10px', minWidth: '300px' }}>
                                    <FaSearch style={{ color: '#9CA3AF', marginRight: '10px' }} />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            <section className="data-panel" style={{ marginTop: '20px' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="clean-table">

                                        {activeTab === 'users' && (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email Address</th>
                                                        <th>Phone Number</th>
                                                        <th>Account Status</th>
                                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(!filteredUsers || filteredUsers.length === 0) ? (
                                                        <tr><td colSpan="5" className="empty-state">No users found.</td></tr>
                                                    ) : (
                                                        filteredUsers?.map((user) => (
                                                            <tr key={user.id} style={{ opacity: user.is_active ? 1 : 0.6 }}>
                                                                <td className="user-cell">{user.full_name}</td>
                                                                <td>{user.email}</td>
                                                                <td style={{ fontFamily: 'monospace' }}>{user.phone}</td>
                                                                <td>
                                                                    <span className={`tag ${user.is_active ? 'tag-completed' : 'tag-planned'}`} style={{ background: user.is_active ? '#D1FAE5' : '#FEE2E2', color: user.is_active ? '#059669' : '#DC2626' }}>
                                                                        {user.is_active ? 'Active' : 'Blocked'}
                                                                    </span>
                                                                </td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                                        <button
                                                                            onClick={() => openUserDetails(user)}
                                                                            title="View Details"
                                                                            style={{
                                                                                background: 'transparent', border: '1px solid #E5E7EB', color: '#6B7280',
                                                                                cursor: 'pointer', padding: '6px 10px', borderRadius: '6px',
                                                                                display: 'inline-flex', alignItems: 'center', transition: '0.2s'
                                                                            }}
                                                                            onMouseOver={(e) => { e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
                                                                            onMouseOut={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'transparent'; }}
                                                                        >
                                                                            <FaEye />
                                                                        </button>

                                                                        <button
                                                                            onClick={() => confirmToggleBlock(user.id, user.is_active)}
                                                                            title={user.is_active ? "Block User" : "Unblock User"}
                                                                            style={{
                                                                                background: user.is_active ? '#FEF2F2' : '#ECFDF5',
                                                                                border: `1px solid ${user.is_active ? '#FECACA' : '#A7F3D0'}`,
                                                                                color: user.is_active ? '#DC2626' : '#059669',
                                                                                cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px',
                                                                                display: 'inline-flex', alignItems: 'center', gap: '6px', transition: '0.2s'
                                                                            }}
                                                                        >
                                                                            {user.is_active ? <><FaLock /> Block</> : <><FaLockOpen /> Unblock</>}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => confirmDelete(user.id, 'User')}
                                                                            title="Delete User"
                                                                            style={{
                                                                                background: 'transparent', border: '1px solid #E5E7EB', color: '#6B7280',
                                                                                cursor: 'pointer', padding: '6px 10px', borderRadius: '6px',
                                                                                display: 'inline-flex', alignItems: 'center', transition: '0.2s'
                                                                            }}
                                                                            onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                                                                            onMouseOut={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'transparent'; }}
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </>
                                        )}

                                        {activeTab === 'trips' && (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th>User Account</th>
                                                        <th>Target Destination</th>
                                                        <th>Travel Dates</th>
                                                        <th>Allocated Budget</th>
                                                        <th>Trip Status</th>
                                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(!filteredTrips || filteredTrips.length === 0) ? (
                                                        <tr><td colSpan="6" className="empty-state">No matching activity found on the platform.</td></tr>
                                                    ) : (
                                                        filteredTrips?.map((trip) => (
                                                            <tr key={trip.id}>
                                                                <td className="user-cell">{trip.user}</td>
                                                                <td>{trip.destination}</td>
                                                                <td style={{ fontSize: '13px', color: '#4B5563' }}>
                                                                    {trip.start_date || 'N/A'} <br /> <span style={{ color: '#9CA3AF' }}>to</span> {trip.end_date || 'N/A'}
                                                                </td>
                                                                <td className="budget-cell">{formatCurrency(trip.budget)}</td>
                                                                <td><span className={`tag ${trip.status === 'completed' ? 'tag-completed' : 'tag-planned'}`}>{trip.status || 'Planned'}</span></td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <button
                                                                            onClick={() => confirmDelete(trip.id, 'Trip')}
                                                                            style={{
                                                                                background: 'transparent', border: '1px solid #E5E7EB', color: '#6B7280',
                                                                                cursor: 'pointer', padding: '6px 10px', borderRadius: '6px',
                                                                                display: 'inline-flex', alignItems: 'center', transition: '0.2s'
                                                                            }}
                                                                            onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                                                                            onMouseOut={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'transparent'; }}
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </>
                                        )}

                                    </table>
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;

