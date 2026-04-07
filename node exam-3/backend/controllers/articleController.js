const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');

const createArticle = async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user._id
    });
    const createdArticle = await article.save();
    
    // Add to user articles array
    await User.findByIdAndUpdate(req.user._id, { $push: { articles: createdArticle._id } });

    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id }).populate('author', 'username').sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'username');
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check user: article author or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to update this article' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check user: article author or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized to delete this article' });
    }

    await User.findByIdAndUpdate(article.author, { $pull: { articles: article._id } });
    await Comment.deleteMany({ article: article._id });
    await Article.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Article removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createArticle, getAllArticles, getMyArticles, getArticleById, updateArticle, deleteArticle };
