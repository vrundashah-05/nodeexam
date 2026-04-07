const Comment = require('../models/Comment');
const Article = require('../models/Article');

const addComment = async (req, res) => {
  const { text } = req.body;
  const { articleId } = req.params;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = new Comment({
      text,
      author: req.user._id,
      article: articleId
    });

    const createdComment = await comment.save();
    
    // populate author before returning
    await createdComment.populate('author', 'username');

    res.status(201).json(createdComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).populate('author', 'username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getCommentsByArticle };
