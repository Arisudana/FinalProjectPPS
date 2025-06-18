import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import ConfirmModal from '../components/ConfirmModal';

// Komponen MeatballMenu tetap sama seperti sebelumnya
const MeatballMenu = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuStyle = {
        position: 'absolute',
        top: '35px',
        right: '10px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 1,
        width: '100px',
    };
    const menuItemStyle = {
        padding: '10px',
        cursor: 'pointer',
    };
    menuItemStyle[':hover'] = {
      backgroundColor: '#f0f0f0'
    };


    return (
        <div ref={menuRef} style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                &#x22EE;
            </button>
            {isOpen && (
                <div style={menuStyle}>
                    <div style={menuItemStyle} onClick={() => { onEdit(); setIsOpen(false); }}>Ubah</div>
                    <div style={menuItemStyle} onClick={() => { onDelete(); setIsOpen(false); }}>Hapus</div>
                </div>
            )}
        </div>
    );
};


const AdminPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingArticle, setDeletingArticle] = useState(null);
    const navigate = useNavigate();

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

    const handleEdit = (article) => {
        navigate(`/admin/edit/${article.id}`);
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

    const handleAddNew = () => {
        navigate('/admin/add');
    };

    const pageStyle = { display: 'flex' };
    const mainContentStyle = { flex: 1, padding: '20px' };
    const articleListStyle = { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' };
    const articleCardStyle = { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', position: 'relative', background: '#fff' };
    const buttonStyle = {
        padding: '8px 16px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '20px',
        background: '#f0f0f0'
    };


    return (
        <div style={pageStyle}>
            <Sidebar />
            <main style={{ width: '100%', background: '#f8f9fa' }}>
                <AdminHeader />
                <div style={mainContentStyle}>
                    {/* Tombol Tambah Artikel dipindahkan ke sini */}
                    <button onClick={handleAddNew} style={buttonStyle}>
                        + Tambah Artikel
                    </button>

                    {loading ? <p>Loading...</p> : (
                        <div style={articleListStyle}>
                            {articles.map(article => (
                                <div key={article.id} style={articleCardStyle}>
                                    <h3>{article.title}</h3>
                                    <p>{article.content.substring(0, 150)}...</p>
                                    <small>Dibuat: {new Date(article.created_at).toLocaleDateString()}</small>
                                    <MeatballMenu
                                        onEdit={() => handleEdit(article)}
                                        onDelete={() => setDeletingArticle(article)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

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