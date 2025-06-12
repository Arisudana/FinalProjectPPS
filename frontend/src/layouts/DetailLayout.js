import { Outlet } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Header sederhana untuk halaman detail
function DetailHeader() {
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #e0e0e0',
    };
    const logoStyle = {
        backgroundColor: '#c4c4c4',
        width: '100px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
    };

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>GGIWP</div>
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
                        <li><Link to="/logout" onClick={() => setIsDropdownOpen(false)}>Logout</Link></li>
                    </ul>
                )}
            </div>
        </header>
    );
}


const DetailLayout = () => {
    return (
        <div>
            <DetailHeader />
            <main>
                <Outlet /> {/* Ini akan merender ArticleDetailPage */}
            </main>
        </div>
    );
};

export default DetailLayout;