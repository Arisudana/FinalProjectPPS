import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onAddNew }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const headerStyle = {
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const buttonStyle = {
        padding: '8px 12px',
        cursor: 'pointer',
    };

    return (
        <header style={headerStyle}>
            <h2>Selamat Datang Admin!</h2>
            <div>
                <button onClick={onAddNew} style={buttonStyle}>+ Tambah Artikel</button>
                <button onClick={handleLogout} style={{...buttonStyle, marginLeft: '10px'}}>Logout</button>
            </div>
        </header>
    );
};

export default AdminHeader;