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
      'SELECT p.post_id, p.post_user_id, p.post_text, p.post_avatar, to_json(array_agg(l.*)) AS likes, to_json(array_agg(c.*)) AS comments FROM posts p LEFT JOIN likes l ON l.like_post_id = p.post_id LEFT JOIN comments c ON c.comment_post_id = p.post_id GROUP BY p.post_id, p.post_user_id, p.post_text, p.post_avatar ORDER BY post_created_at DESC'
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

    const post = await pool.query('SELECT * FROM posts WHERE post_id = $1', [
      req.params.id,
    ]);

    if (!post.rows.length) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user owns post

    const deletePost = await pool.query(
      'DELETE FROM posts WHERE post_id = $1 AND post_user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (!deletePost.rows.length) {
      return res.status(401).json({ msg: 'User not authorised' });
    }

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private

router.post('/like/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const checkPost = await pool.query(
      'SELECT * FROM posts WHERE post_id = $1',
      [req.params.id]
    );

    if (!checkPost.rows.length) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check post not liked already

    const checkLike = await pool.query(
      'SELECT * FROM likes WHERE like_post_id = $1 AND like_user_id = $2',
      [req.params.id, req.user.id]
    );

    if (checkLike.rows.length) {
      return res
        .status(401)
        .json({ msg: 'Post already liked, user not authorized' });
    }

    // Create like

    const newLike = await pool.query(
      'INSERT INTO likes (like_post_id, like_user_id) VALUES ($1, $2) RETURNING *',
      [req.params.id, req.user.id]
    );

    res.json(newLike.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/posts/unlike/:id
// @desc Unlike a post
// @access Private

router.delete('/unlike/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const checkPost = await pool.query(
      'SELECT * FROM posts WHERE post_id = $1',
      [req.params.id]
    );

    if (!checkPost.rows.length) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check post not liked already

    const checkLike = await pool.query(
      'SELECT * FROM likes WHERE like_post_id = $1 AND like_user_id = $2',
      [req.params.id, req.user.id]
    );

    if (!checkLike.rows.length) {
      return res
        .status(401)
        .json({ msg: 'Post not liked, user not authorized' });
    }

    // Delete like

    const deleteLike = await pool.query(
      'DELETE FROM likes WHERE like_post_id = $1 and like_user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    res.json({ msg: 'Post unliked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
