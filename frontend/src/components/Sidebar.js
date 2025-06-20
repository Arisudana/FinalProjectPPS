import React from 'react';

const Sidebar = () => {
    const sidebarStyle = {
        width: '220px',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        height: '100vh',
    };
    const logoStyle = {
        backgroundColor: '#9c8c8c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        padding: '20px',
        ontWeight: 'bold',
        color: 'white',
        fontSize: '20px'
    };
    const menuActiveStyle = {
        backgroundColor: '#dcdcdc',
        padding: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
    };
     const menuStyle = {
        padding: '15px',
        cursor: 'pointer',
    };

    return (
        <div style={sidebarStyle}>
            <div style={logoStyle}>Logo<br /> GG!WP</div>
            <nav>
                <div style={menuActiveStyle}>Artikel</div>
                <div style={menuStyle}>Asesmen</div>
            </nav>
        </div>
    );
};

export default Sidebar;