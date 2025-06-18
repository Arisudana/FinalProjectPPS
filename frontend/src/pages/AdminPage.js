import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader'; // Kita akan buat header khusus admin
import ArticleForm from '../components/ArticleForm';
import ConfirmModal from '../components/ConfirmModal';

const AdminPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [deletingArticle, setDeletingArticle] = useState(null);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/articles');
            setArticles(response.data);
        } catch (error) {
            console.error("Gagal mengambil artikel:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleFormClose = () => {
        setIsFormVisible(false);
        setEditingArticle(null);
    };

    const handleFormSuccess = () => {
        handleFormClose();
        fetchArticles(); // Muat ulang daftar artikel
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingArticle(null);
        setIsFormVisible(true);
    };

    const handleDelete = async () => {
        if (!deletingArticle) return;
        try {
            await axios.delete(`http://localhost:5000/api/articles/${deletingArticle.id}`);
            setDeletingArticle(null);
            fetchArticles();
        } catch (error) {
            console.error("Gagal menghapus artikel:", error);
            alert("Gagal menghapus artikel.");
        }
    };

    const pageStyle = { display: 'flex' };
    const mainContentStyle = { flex: 1, padding: '20px' };
    const articleListStyle = { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' };
    const articleCardStyle = { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px', position: 'relative' };
    const dotsStyle = { position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontWeight: 'bold' };

    return (
        <div style={pageStyle}>
            <Sidebar />
            <main style={{ width: '100%' }}>
                <AdminHeader onAddNew={handleAddNew} />
                <div style={mainContentStyle}>
                    {loading ? <p>Loading...</p> : (
                        <div style={articleListStyle}>
                            {articles.map(article => (
                                <div key={article.id} style={articleCardStyle}>
                                    <h3>{article.title}</h3>
                                    <p>{article.content.substring(0, 100)}...</p>
                                    <small>Dibuat: {new Date(article.created_at).toLocaleDateString()}</small>
                                    <div className="admin-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(article)}>Ubah</button>
                                        <button onClick={() => setDeletingArticle(article)} style={{ background: '#dc3545', color: 'white' }}>Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {isFormVisible && (
                <ArticleForm
                    article={editingArticle}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}

            {deletingArticle && (
                <ConfirmModal
                    title="Konfirmasi Penghapusan"
                    message={`Apakah anda yakin ingin menghapus artikel "${deletingArticle.title}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingArticle(null)}
                />
            )}
        </div>
    );
};

export default AdminPage;