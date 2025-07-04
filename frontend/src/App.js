import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Import Layouts
import MainLayout from './layouts/MainLayout';
import DetailLayout from './layouts/DetailLayout';

// Import Pages
import ArticlePage from './pages/ArticlePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LoginPage from './pages/LoginPage'; 
import AdminPage from './pages/AdminPage';
import ArticleEditorPage from './pages/ArticleEditorPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute yang menggunakan MainLayout (dengan Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ArticlePage />} />
        </Route>
        {/* Rute yang menggunakan DetailLayout (tanpa Sidebar) */}
        <Route element={<DetailLayout />}>
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
        </Route>
        {/* Rute untuk halaman login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Rute untuk halaman admin yang dilindungi */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        {/* Rute untuk halaman tambah artikel */}
        <Route 
          path="/admin/add" 
          element={
            <ProtectedRoute>
              <ArticleEditorPage />
            </ProtectedRoute>
          }
        />
        {/* Rute untuk halaman editor artikel (tambah/edit) */}
        <Route 
          path="/admin/edit/:id?" 
          element={
            <ProtectedRoute>
              <ArticleEditorPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;