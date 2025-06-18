import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref untuk mendeteksi klik di luar dropdown

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Menutup dropdown jika klik di luar area dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on cleanup
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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
            <div className="user-profile" ref={dropdownRef}>
                <button className="user-icon-button" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <FontAwesomeIcon
                        icon={isDropdownOpen ? faCaretUp : faCaretDown}
                        className="caret-icon"
                    />
                </button>
                {isDropdownOpen && (
                    <ul className="dropdown-menu">
                        <li><Link to="/my-account" onClick={() => setIsDropdownOpen(false)}>Akun Saya</Link></li>
                        <li><Link to="/settings" onClick={() => setIsDropdownOpen(false)}>Pengaturan</Link></li>
                        <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;