const express = require('express');
const router = express.Router();
const { addComment, getCommentsByArticle } = require('../controllers/commentController');
const { verifyJWT } = require('../middleware/auth');

router.post('/:articleId', verifyJWT, addComment);
router.get('/:articleId', getCommentsByArticle);

module.exports = router;
