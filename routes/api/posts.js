const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

const pool = require('../../db');

// @route POST api/posts
// @desc Create a post
// @access Private

router.post(
  '/',
  [auth, [body('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const newPost = await pool.query(
        'INSERT INTO posts (post_user_id, post_text, post_avatar) VALUES ($1, $2, (SELECT user_avatar FROM users WHERE user_id = $1)) RETURNING *',
        [req.user.id, text]
      );

      res.json(newPost.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/posts
// @desc Get all post
// @access Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await pool.query(
      'SELECT * FROM posts ORDER BY post_created_at DESC'
    );

    res.json(posts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/posts/:id
// @desc Get post by id
// @access Private

router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await pool.query(
      'SELECT * FROM posts WHERE post_id = $1 ORDER BY post_created_at DESC',
      [req.params.id]
    );

    if (!posts.rows.length) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    res.json(posts.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const post = await pool.query(
      'SELECT * FROM posts WHERE post_id = $1',
      [req.params.id]
    );

    if (!post.rows.length) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user owns post

    const deletePost = await pool.query('DELETE FROM posts WHERE post_id = $1 AND post_user_id = $2 RETURNING *', [req.params.id, req.user.id]);

    if (!deletePost.rows.length) {
      return res.status(401).json({ msg: 'User not authorised' });
    }
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
