import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const modalStyle = { background: 'white', padding: '20px', borderRadius: '8px', width: '400px', textAlign: 'center' };
    const buttonContainerStyle = { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div style={buttonContainerStyle}>
                    <button onClick={onCancel}>Tidak</button>
                    <button onClick={onConfirm} style={{ background: '#dc3545', color: 'white' }}>Ya</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;