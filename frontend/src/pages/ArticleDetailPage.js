import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArticleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // DITAMBAHKAN: State untuk melacak status 'suka' dari user
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
                setArticle(response.data);
                
                // DITAMBAHKAN: Cek localStorage untuk melihat apakah artikel ini sudah disukai
                const likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
                if (likedArticles.includes(id)) {
                    setIsLiked(true);
                }

            } catch (err) {
                setError('Gagal memuat artikel atau artikel tidak ditemukan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    // DIUBAH: Fungsi untuk menangani toggle like/unlike
    const handleToggleLike = async () => {
        const endpoint = isLiked ? 'unlike' : 'like';
        const newIsLiked = !isLiked;

        // Optimistic UI Update
        setIsLiked(newIsLiked);
        setArticle(prevArticle => ({
            ...prevArticle,
            likes_count: newIsLiked ? prevArticle.likes_count + 1 : prevArticle.likes_count - 1,
        }));
        
        // Update localStorage
        let likedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
        if (newIsLiked) {
            likedArticles.push(id);
        } else {
            likedArticles = likedArticles.filter(articleId => articleId !== id);
        }
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));

        // Kirim request ke backend
        try {
            await axios.patch(`http://localhost:5000/api/articles/${id}/${endpoint}`);
        } catch (err) {
            console.error(`Gagal ${endpoint} artikel:`, err);
            // Jika gagal, kembalikan state ke semula (rollback)
            setIsLiked(!newIsLiked);
            setArticle(prevArticle => ({
                ...prevArticle,
                likes_count: !newIsLiked ? prevArticle.likes_count + 1 : prevArticle.likes_count - 1,
            }));
             // Rollback localStorage juga
            let currentLiked = JSON.parse(localStorage.getItem('likedArticles')) || [];
             if (!newIsLiked) { currentLiked.push(id); } 
             else { currentLiked = currentLiked.filter(articleId => articleId !== id); }
             localStorage.setItem('likedArticles', JSON.stringify(currentLiked));
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
    if (!article) return null;

    // --- STYLING BARU ---
    // Poin 6: Padding kanan dan kiri
    const pageStyle = {
        padding: '20px 10%', // Padding atas-bawah 20px, kanan-kiri 10%
        fontFamily: 'sans-serif'
    };
    
    // Style untuk header (Tag di kiri, Tombol di kanan)
    const articleHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };

    // Poin 3: Paragraf Justify
    const contentStyle = {
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        textAlign: 'justify'
    };

    const buttonStyle = {
        cursor: 'pointer',
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#f0f0f0'
    };

    const likedButtonStyle = {
        ...buttonStyle,
        background: '#e0f7fa',
        borderColor: '#007bff'
    };

    return (
        <div style={pageStyle}>
            {/* Poin 1: Tombol Kembali diperbaiki */}
            <button onClick={() => navigate('/')} style={{ ...buttonStyle, marginBottom: '20px' }}>
                &larr; Kembali
            </button>
            
            <h1>{article.title}</h1>
            <p>
                Oleh: <strong>{article.author}</strong> | Tanggal Terbit: {new Date(article.created_at).toLocaleDateString('id-ID')}
            </p>

            {/* Poin 4: Penempatan Tombol Suka/Bagikan */}
            <div style={articleHeaderStyle}>
                <div> {/* Wadah untuk tag */}
                    <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', marginRight: '10px', borderRadius: '5px' }}>Tag #1</span>
                    <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', marginRight: '10px', borderRadius: '5px' }}>Tag #2</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}> {/* Wadah untuk tombol */}
                    <button onClick={handleToggleLike} style={isLiked ? likedButtonStyle : buttonStyle}>
                        ❤️ {article.likes_count} {isLiked ? 'Disukai' : 'Suka'}
                    </button>
                    <button style={buttonStyle}>
                        🔗 Bagikan
                    </button>
                </div>
            </div>

            {/* Poin 3: Divider Garis */}
            <hr style={{ border: 'none', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}/>

            <div style={contentStyle}>
                {article.content}
            </div>
        </div>
    );
};

export default ArticleDetailPage;