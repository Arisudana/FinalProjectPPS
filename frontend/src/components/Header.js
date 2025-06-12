import React from 'react';

const Header = () => {
    const headerStyle = {
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };
    return (
        <header style={headerStyle}>
            <h2>Selamat Datang User1!</h2>
            <div>Icon</div>
        </header>
    );
};

export default Header;