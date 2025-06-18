import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArticleEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // State untuk form
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    // --- Perubahan State untuk Tags ---
    const [tags, setTags] = useState([]); // Tags disimpan sebagai array
    const [tagInput, setTagInput] = useState(''); // State untuk input tag saat ini

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memuat data artikel saat dalam mode edit
    useEffect(() => {
        if (isEditMode) {
            const fetchArticle = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
                    const article = response.data;
                    setTitle(article.title);
                    setAuthor(article.author || 'Admin');
                    setContent(article.content);
                    setImageUrl(article.image_url || '');
                    
                    // --- Mengubah string tags dari DB menjadi array ---
                    if (article.tags && typeof article.tags === 'string') {
                        setTags(article.tags.split(',').map(tag => tag.trim()).filter(Boolean)); // Filter untuk menghapus tag kosong
                    }
                } catch (err) {
                    setError('Gagal memuat data artikel.');
                    console.error(err);
                }
            };
            fetchArticle();
        }
    }, [id, isEditMode]);

    // --- Logika Baru untuk Menangani Input Tag ---
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault(); // Mencegah form tersubmit saat menekan Enter
            const newTag = tagInput.trim();
            if (!tags.includes(newTag)) { // Hindari duplikasi tag
                setTags([...tags, newTag]);
            }
            setTagInput(''); // Kosongkan input field
        }
    };
    
    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // --- Mengubah array tags kembali menjadi string sebelum mengirim ---
        const articleData = { 
            title, 
            content, 
            image_url: imageUrl, 
            author, 
            tags: tags.join(',') // Gabungkan array menjadi string
        };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/articles/${id}`, articleData);
            } else {
                await axios.post('http://localhost:5000/api/articles', articleData);
            }
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.msg || 'Terjadi kesalahan pada server.');
            setIsSubmitting(false);
        }
    };
    
    // Styling
    const mainContentStyle = { width: '100%', padding: '20px 40px' };
    const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
    const inputStyle = { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '100%', boxSizing: 'border-box' };
    const textareaStyle = { ...inputStyle, height: '200px', resize: 'vertical' };
    const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };
    const errorStyle = { color: 'red', marginTop: '10px' };
    const tagContainerStyle = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' };
    const tagPillStyle = { display: 'flex', alignItems: 'center', background: '#e0e0e0', padding: '5px 10px', borderRadius: '15px', fontSize: '14px' };
    const tagRemoveBtnStyle = { marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' };

    return (
        <main style={mainContentStyle}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                &larr; Kembali
            </button>
            <h2>{isEditMode ? 'Ubah Artikel' : 'Tambah Artikel'}</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                 <div>
                    <label>Judul Artikel</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                    <label>Author</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={inputStyle} required />
                </div>
                
                {/* --- Input Tag yang Sudah Dimodifikasi --- */}
                <div>
                    <label>Tag</label>
                    <div style={tagContainerStyle}>
                        {tags.map((tag, index) => (
                            <div key={index} style={tagPillStyle}>
                                {tag}
                                <button type="button" onClick={() => removeTag(index)} style={tagRemoveBtnStyle}>×</button>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Ketik tag lalu tekan Enter"
                            style={{ ...inputStyle, border: 'none', outline: 'none', flex: 1, minWidth: '200px' }}
                        />
                    </div>
                </div>

                <div>
                    <label>Isi Artikel</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} style={textareaStyle} required />
                </div>
                <div>
                    <label>Upload Foto (URL)</label>
                    <input type="text" placeholder="https://example.com/image.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                <div style={buttonContainerStyle}>
                    <button type="button" onClick={() => navigate('/admin')} disabled={isSubmitting} style={{background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Batal</button>
                    <button type="submit" disabled={isSubmitting} style={{background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
            </form>
        </main>
    );
};

export default ArticleEditorPage;