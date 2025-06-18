import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArticleForm = ({ article, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setContent(article.content);
            setImageUrl(article.image_url || '');
        }
    }, [article]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const articleData = {
            title,
            content,
            image_url: imageUrl,
        };

        try {
            if (article) {
                // Edit mode
                await axios.put(`http://localhost:5000/api/articles/${article.id}`, articleData);
            } else {
                // Create mode
                await axios.post('http://localhost:5000/api/articles', articleData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.msg || 'Terjadi kesalahan pada server.');
            setIsSubmitting(false);
        }
    };
    
    // Styling
    const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const formStyle = { background: 'white', padding: '20px', borderRadius: '8px', width: '500px', display: 'flex', flexDirection: 'column', gap: '15px' };
    const inputStyle = { width: '95%', padding: '10px' };
    const textareaStyle = { ...inputStyle, height: '150px', resize: 'vertical' };
    const errorStyle = { color: 'red', marginTop: '10px' };

    return (
        <div style={overlayStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2>{article ? 'Ubah Artikel' : 'Tambah Artikel Baru'}</h2>
                <input type="text" placeholder="Judul Artikel" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                <textarea placeholder="Konten Artikel" value={content} onChange={e => setContent(e.target.value)} style={textareaStyle} required />
                <input type="text" placeholder="URL Gambar (Opsional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                {error && <p style={errorStyle}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={onClose} disabled={isSubmitting}>Batal</button>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;