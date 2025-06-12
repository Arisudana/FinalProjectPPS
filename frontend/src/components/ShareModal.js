import React, { useEffect, useRef } from 'react';
import './ShareModal.css'; // Import file CSS

const ShareModal = ({ isOpen, onClose, articleUrl }) => {
  const modalRef = useRef();

  // Handle click outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(articleUrl)
      .then(() => {
        alert('URL berhasil disalin ke clipboard!');
      })
      .catch((err) => {
        console.error('Gagal menyalin URL:', err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-content" ref={modalRef}>
        <h2>Bagikan Artikel</h2>
        <div className="share-url-container">
          <input type="text" value={articleUrl} readOnly className="share-url-input" />
          <button onClick={handleCopyClick} className="copy-button">
            <i className="fas fa-clipboard"></i> {/* Icon clipboard, pastikan Font Awesome terinstal */}
          </button>
        </div>
        <button onClick={onClose} className="close-button">X</button>
      </div>
    </div>
  );
};

export default ShareModal;