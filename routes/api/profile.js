const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const pool = require('../../db');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await pool.query(
      'SELECT user_id, user_name, user_avatar FROM users INNER JOIN profiles USING(user_id) WHERE user_id = $1',
      [req.user.id]
    );

    if (!profile.rows.length) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
