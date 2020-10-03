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
// @desc Get all posts
// @access Private

router.get('/', auth, async (req, res) => {
  try {
   
    const posts = await pool.query(
      'SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT json_agg(l) as likes FROM likes l WHERE l.like_post_id = p.post_id) l ON TRUE LEFT JOIN LATERAL (SELECT json_agg(c) AS comments FROM comments c WHERE c.comment_post_id = p.post_id) c on TRUE ORDER BY p.post_created_at DESC' 
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
      'SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT json_agg(l) as likes FROM likes l WHERE l.like_post_id = p.post_id) l ON TRUE LEFT JOIN LATERAL (SELECT json_agg(c) AS comments FROM comments c WHERE c.comment_post_id = p.post_id) c on TRUE WHERE p.post_id = $1',
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

// @route POST api/posts/commnet/:id
// @desc Add a comment to a post
// @access Private

router.post(
  '/comment/:id',
  [auth, [body('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      // Check post exists

      const checkPost = await pool.query(
        'SELECT * FROM posts WHERE post_id = $1',
        [req.params.id]
      );

      if (!checkPost.rows.length) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = await pool.query(
        'INSERT INTO comments(comment_user_id, comment_post_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, req.params.id, text]
      );

      res.json(newComment.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;
