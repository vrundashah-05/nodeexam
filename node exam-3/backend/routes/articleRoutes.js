const express = require('express');
const router = express.Router();
const { createArticle, getAllArticles, getMyArticles, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController');
const { verifyJWT } = require('../middleware/auth');

router.get('/', getAllArticles);
router.get('/my', verifyJWT, getMyArticles);
router.get('/:id', getArticleById);
router.post('/', verifyJWT, createArticle);
router.put('/:id', verifyJWT, updateArticle);
router.delete('/:id', verifyJWT, deleteArticle);

module.exports = router;
