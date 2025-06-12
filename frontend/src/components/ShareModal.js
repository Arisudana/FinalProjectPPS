import React, { useState, useEffect } from 'react';
import './ShareModal.css'; // Kita akan buat file CSS ini selanjutnya

const ShareModal = ({ isOpen, onClose, url }) => {
    const [copyButtonText, setCopyButtonText] = useState('Salin');

    // Reset teks tombol "Salin" setiap kali modal dibuka kembali
    useEffect(() => {
        if (isOpen) {
            setCopyButtonText('Salin');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null; // Jangan render apapun jika modal tidak terbuka
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopyButtonText('Disalin!');
            setTimeout(() => {
                setCopyButtonText('Salin');
            }, 2000); // Kembalikan teks setelah 2 detik
        }).catch(err => {
            console.error('Gagal menyalin URL:', err);
        });
    };

    // Mencegah modal tertutup saat konten di dalamnya diklik
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Gunakan `onClose` untuk menutup saat overlay diklik
        <div className="popup-container" onClick={onClose}> 
            <div className="popup-modal" onClick={handleModalContentClick}>
                <h2>Bagikan Artikel</h2>
                <div className="link-container">
                    <input type="text" value={url} readOnly />
                    <button 
                        onClick={handleCopy} 
                        className={copyButtonText === 'Disalin!' ? 'copied' : ''}
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;