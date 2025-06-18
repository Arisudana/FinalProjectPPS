const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET: Mendapatkan semua artikel
router.get('/', async (req, res) => {
    try {
        const allArticles = await pool.query("SELECT * FROM articles ORDER BY created_at DESC");
        res.json(allArticles.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET: Mendapatkan artikel tunggal berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);

        if (article.rows.length === 0) {
            return res.status(404).json("Artikel tidak ditemukan");
        }

        res.json(article.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// POST: Membuat artikel baru (Sesuai use case 1a.4) 
router.post('/', async (req, res) => {
    try {
        const { title, content, image_url, author, tags } = req.body;
        // Exception path E1.3: Validasi input 
        if (!title || !content|| !author) {
            return res.status(400).json({ msg: "Mohon lengkapi semua informasi yang diperlukan sebelum menyimpan." });
        }
        const newArticle = await pool.query(
            "INSERT INTO articles (title, content, image_url, author, tags) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [title, content, image_url, author, tags]
        );
        // System response: Artikel Berhasil Dibuat 
        res.json({ msg: "Artikel Berhasil Dibuat", article: newArticle.rows[0] });
    } catch (err) {
        console.error(err.message);
         // Exception path E2.3: Judul sudah ada 
        if (err.code === '23505') { 
            return res.status(400).json({ msg: "Judul artikel sudah digunakan. Harap gunakan judul yang berbeda." });
        }
        // Exception path E3.4: Gagal menyimpan 
        res.status(500).json({ msg: "Gagal menyimpan perubahan. Silakan coba lagi nanti." });
    }
});

// PUT: Memperbarui artikel berdasarkan ID (Sesuai UCD 1b)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image_url, author, tags } = req.body;

        // Validasi input
        if (!title || !content || !author) {
            return res.status(400).json({ msg: "Mohon lengkapi semua informasi yang diperlukan sebelum menyimpan." });
        }

        const updateArticle = await pool.query(
            "UPDATE articles SET title = $1, content = $2, image_url = $3, author = $4, tags = $5 WHERE id = $6 RETURNING *",
            [title, content, image_url, author || 'Admin', tags, id]
        );

        if (updateArticle.rows.length === 0) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan." });
        }
        // System response: Artikel Berhasil Diubah 
        res.json({ msg: "Artikel Berhasil Diubah", article: updateArticle.rows[0] });
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(400).json({ msg: "Judul artikel sudah digunakan. Harap gunakan judul yang berbeda." });
        }
        res.status(500).json({ msg: "Gagal menyimpan perubahan. Silakan coba lagi nanti." });
    }
});

// DELETE: Menghapus artikel (Sesuai UCD 1c.6) 
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteOp = await pool.query("DELETE FROM articles WHERE id = $1 RETURNING id", [id]);

        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: "Artikel tidak ditemukan." });
        }

        res.json({ msg: "Artikel Berhasil Dihapus" }); // System response 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// PATCH: Menambah jumlah 'suka' (like)
router.patch('/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE articles SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count",
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json("Artikel tidak ditemukan");
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// PATCH: Mengurangi jumlah 'suka' (unlike)
router.patch('/:id/unlike', async (req, res) => {
    try {
        const { id } = req.params;
        // Pastikan likes_count tidak menjadi negatif
        const result = await pool.query(
            "UPDATE articles SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1 RETURNING likes_count",
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json("Artikel tidak ditemukan");
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;