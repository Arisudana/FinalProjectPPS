import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const layoutStyle = {
        display: 'flex'
    };

    return (
        <div style={layoutStyle}>
            <Sidebar />
            <main style={{ width: '100%' }}>
                <Outlet /> {/* Ini akan merender halaman (misal: ArticlePage) */}
            </main>
        </div>
    );
};

export default MainLayout;