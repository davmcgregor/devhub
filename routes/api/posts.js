const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { body, validationResult } = require('express-validator')

const db = require('../../db')

// @route POST api/posts
// @desc Create a post
// @access Private

router.post(
  '/',
  [auth, [body('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { text } = req.body

    try {
      const newPost = await db.createPost(req.user.id, text)

      res.json(newPost.rows[0])
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route GET api/posts
// @desc Get all posts
// @access Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await db.getAllPosts()

    res.json(posts.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route GET api/posts/:id
// @desc Get post by id
// @access Private

router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await db.getPost(req.params.id)

    if (!posts.rows.length) {
      return res.status(400).json({ msg: 'Post not found' })
    }

    res.json(posts.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const post = await db.checkPost(req.params.id)

    if (!post.rows.length) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Delete if user owns post

    const deletePost = await db.deletePost(req.params.id, req.user.id)

    if (!deletePost.rows.length) {
      return res.status(401).json({ msg: 'User not authorised' })
    }

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private

router.post('/like/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const checkPost = await db.checkPost(req.params.id)

    if (!checkPost.rows.length) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Check post not liked already

    const checkLike = await db.checkLike(req.params.id, req.user.id)

    if (checkLike.rows.length) {
      return res
        .status(401)
        .json({ msg: 'Post already liked, user not authorized' })
    }

    // Create like

    await db.createLike(req.params.id, req.user.id)

    // Return the likes for that post

    const allLikes = await db.allLikes(req.params.id)

    res.json(allLikes.rows[0]["coalesce"])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route DELETE api/posts/unlike/:id
// @desc Unlike a post
// @access Private

router.delete('/unlike/:id', auth, async (req, res) => {
  try {
    // Check post exists

    const checkPost = await db.checkPost(req.params.id)

    if (!checkPost.rows.length) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Check post not liked already

    const checkLike = await db.checkLike(req.params.id, req.user.id)

    if (!checkLike.rows.length) {
      return res
        .status(401)
        .json({ msg: 'Post not liked, user not authorized' })
    }

    // Delete like

    await db.deleteLike(req.params.id, req.user.id)

    // Return the likes for that post

    const allLikes = await db.allLikes(req.params.id)

    res.json(allLikes.rows[0]["coalesce"])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route POST api/posts/comment/:id
// @desc Add a comment to a post
// @access Private

router.post(
  '/comment/:id',
  [auth, [body('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { text } = req.body

    try {
      // Check post exists

      const checkPost = await db.checkPost(req.params.id)

      if (!checkPost.rows.length) {
        return res.status(404).json({ msg: 'Post not found' })
      }

      const newComment = await db.createComment(
        req.user.id,
        req.params.id,
        text
      )

      res.json(newComment.rows[0])
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc Delete comment
// @access Private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    //check post exists

    const checkPost = await db.checkPost(req.params.post_id)

    if (!checkPost.rows.length) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    //check comment exists

    const checkComment = await db.checkComment(req.params.comment_id)

    if (!checkComment.rows.length) {
      return res.status(404).json({ msg: 'Comment not found' })
    }

    // Delete if user owns comment

    const deleteComment = await db.deleteComment(
      req.params.comment_id,
      req.user.id
    )

    if (!deleteComment.rows.length) {
      return res.status(401).json({ msg: 'User not authorised' })
    }

    res.json({ msg: 'Comment removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
