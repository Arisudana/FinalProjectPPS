import React from 'react';
import { Outlet } from 'react-router-dom';

// Header sederhana untuk halaman detail
const DetailHeader = () => {
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
            <div>Icon User</div>
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