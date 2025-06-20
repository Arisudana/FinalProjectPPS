import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    const overlayStyle = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    };

    const modalStyle = {
        background: 'white',
        padding: '30px 20px',
        borderRadius: '10px',
        width: '350px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif'
    };

    const titleStyle = {
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: 'bold'
    };

    const messageStyle = {
        fontSize: '16px',
        marginBottom: '20px'
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '10px'
    };

    const cancelButtonStyle = {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const confirmButtonStyle = {
        backgroundColor: '#444',
        color: 'white',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={titleStyle}>{title}</div>
                <div style={messageStyle}>{message}</div>
                <div style={buttonContainerStyle}>
                    <button onClick={onCancel} style={cancelButtonStyle}>Batal</button>
                    <button onClick={onConfirm} style={confirmButtonStyle}>Ya</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
