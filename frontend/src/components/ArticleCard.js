import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const ArticleCard = ({ article }) => {
    // ... (copy semua style dari file sebelumnya)
    const cardStyle = { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '20px' };
    const imagePlaceholderStyle = { width: '150px', height: '150px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px', flexShrink: 0 };
    const contentStyle = { flex: 1 };
    const tagStyle = { backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px', marginRight: '10px', display: 'inline-block', fontSize: '12px' };

    return (
        // Bungkus dengan Link dan hapus styling default-nya
        <Link to={`/articles/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={cardStyle}>
                <div style={imagePlaceholderStyle}>
                    {/* Menampilkan gambar asli jika ada */}
                    <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={contentStyle}>
                    <h3>{article.title}</h3>
                    <p>{article.content.substring(0, 150)}...</p>
                    <small>Oleh: {article.author} | Disukai: {article.likes_count}</small>
                    <div style={{ marginTop: '10px' }}>
                        {article.tags && article.tags.split(',').map((tag, index) => (
                            <span key={index} style={tagStyle}>{tag.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;