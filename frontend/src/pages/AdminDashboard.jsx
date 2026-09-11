import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaShieldAlt, FaUsers, FaUserShield, FaAppleAlt, FaUtensils, FaTint, FaWeight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data.stats);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                    setError('Access denied. You must be an admin to view this page.');
                } else {
                    setError('Failed to load admin dashboard. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-5 text-light">Loading admin dashboard...</div>;

    if (error) {
        return (
            <div className="card text-center p-5 bg-dark" style={{ borderLeft: '4px solid var(--danger)' }}>
                <FaShieldAlt size={40} color="var(--danger)" style={{ marginBottom: '15px' }} />
                <h3>Access Denied</h3>
                <p className="text-light mt-2">{error}</p>
                <Link to="/dashboard" className="btn mt-4" style={{ backgroundColor: 'var(--accent)' }}>
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: <FaUsers size={28} />,
            color: '#2196f3',
            description: 'Registered regular users'
        },
        {
            label: 'Total Admins',
            value: stats.totalAdmins,
            icon: <FaUserShield size={28} />,
            color: '#9c27b0',
            description: 'Administrator accounts'
        },
        {
            label: 'Food Items',
            value: stats.totalFoodItems,
            icon: <FaAppleAlt size={28} />,
            color: '#4caf50',
            description: 'Items in master food database'
        },
        {
            label: 'Total Meals',
            value: stats.totalMeals,
            icon: <FaUtensils size={28} />,
            color: '#ff9800',
            description: 'Meals logged across all users'
        },
        {
            label: 'Water Logs',
            value: stats.totalWaterLogs,
            icon: <FaTint size={28} />,
            color: '#00bcd4',
            description: 'Water entries across all users'
        },
        {
            label: 'Weight Logs',
            value: stats.totalWeightLogs,
            icon: <FaWeight size={28} />,
            color: '#e91e63',
            description: 'Weight records across all users'
        }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="mb-4">
                <h1>
                    <FaShieldAlt style={{ color: '#9c27b0', marginRight: '10px' }} />
                    Admin Dashboard
                </h1>
                <p className="text-light mt-2">
                    Platform-wide statistics. Only visible to administrators.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '20px'
            }}>
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="card bg-dark"
                        style={{ borderTop: `4px solid ${card.color}` }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <div style={{
                                color: card.color,
                                backgroundColor: `${card.color}22`,
                                borderRadius: '50%',
                                width: '52px',
                                height: '52px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{card.label}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1.1 }}>{card.value}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
