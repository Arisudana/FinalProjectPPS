import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import Header from '../components/Header';

// Dummy data untuk fallback jika API gagal
const dummyArticles = [
    { id: 1, title: 'Judul Artikel Dummy #1', content: 'Lorem ipsum dolor sit amet...', created_at: new Date().toISOString() },
    { id: 2, title: 'Judul Artikel Dummy #2', content: 'Consectetur adipiscing elit...', created_at: new Date().toISOString() },
];

const ArticlePage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Panggil API dari backend
                const response = await axios.get('http://localhost:5000/api/articles');
                setArticles(response.data);
            } catch (error) {
                console.error("Gagal mengambil data dari API:", error);
                // Jika gagal, gunakan data dummy
                setArticles(dummyArticles);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const pageStyle = {
        flex: 1,
        padding: '20px'
    };

    return (
        <div style={pageStyle}>
            <Header />
            <div style={{ marginTop: '20px' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ArticlePage;