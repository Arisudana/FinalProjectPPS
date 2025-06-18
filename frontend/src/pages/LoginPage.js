import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { password });
            login(response.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Password salah. Silakan coba lagi.');
            console.error(err);
        }
    };

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
    };
    
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '300px'
    };
    
    const inputStyle = { padding: '10px', fontSize: '16px' };
    const buttonStyle = { padding: '10px', fontSize: '16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none' };
    const errorStyle = { color: 'red', marginTop: '10px' };

    return (
        <div style={pageStyle}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password"
                    style={inputStyle}
                    required
                />
                <button type="submit" style={buttonStyle}>Login</button>
            </form>
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};

export default LoginPage;