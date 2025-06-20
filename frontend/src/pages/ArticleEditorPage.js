import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../components/Header.css'; // Import CSS for styling


const ArticleEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { logout } = useAuth();

    // Form states
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown logic
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load article if editing
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
                    if (article.tags && typeof article.tags === 'string') {
                        setTags(article.tags.split(',').map(tag => tag.trim()).filter(Boolean));
                    }
                } catch (err) {
                    setError('Gagal memuat data artikel.');
                    console.error(err);
                }
            };
            fetchArticle();
        }
    }, [id, isEditMode]);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const articleData = {
            title,
            content,
            image_url: imageUrl,
            author,
            tags: tags.join(','),
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

    // --- Styling ---
    const inputStyle = {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '100%',
        boxSizing: 'border-box',
    };

    const textareaStyle = { ...inputStyle, height: '200px', resize: 'vertical' };
    const tagContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '8px',
    };
    const tagPillStyle = {
        display: 'flex',
        alignItems: 'center',
        background: '#e0e0e0',
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '14px',
    };
    const tagRemoveBtnStyle = {
        marginLeft: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
    };
    const errorStyle = { color: 'red', marginTop: '10px' };
    const buttonStyle = {
        cursor: 'pointer',
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#f0f0f0'
    };

    // --- Render ---
    return (
        <div>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #ccc' }}>
                {/* Logo Section */}
                <div style={{ background: '#9c8c8c', color: 'white', padding: '20px', fontWeight: 'bold', fontSize: '20px' }}>
                    Logo<br />GG!WP
                </div>

                {/* Profile Dropdown */}
                <div className="user-profile" ref={dropdownRef}>
                    <button
                        className="user-icon-button"
                        onClick={toggleDropdown}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        <FontAwesomeIcon icon={isDropdownOpen ? faCaretUp : faCaretDown} />
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li><Link to="/my-account" onClick={() => setIsDropdownOpen(false)}>Akun Saya</Link></li>
                            <li><Link to="/settings" onClick={() => setIsDropdownOpen(false)}>Pengaturan</Link></li>
                            <li><Link
                                to="/login"
                                onClick={() => {
                                    logout();
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Logout
                            </Link></li>
                        </ul>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate('/admin')} style={{ ...buttonStyle, marginBottom: '20px' }}>
                    &larr; Kembali
                </button>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label>Judul Artikel</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label>Author</label>
                        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={inputStyle} required />
                    </div>
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
                        <label>Upload Foto 📤</label>
                        <input type="text" placeholder="https://example.com/image.png" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                    </div>
                    {error && <p style={errorStyle}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={() => navigate('/admin')} disabled={isSubmitting} style={{ background: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>Batal</button>
                        <button type="submit" disabled={isSubmitting} style={{ background: '#ccc', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ArticleEditorPage;