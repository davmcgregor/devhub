require('dotenv').config();
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../db');

// @route    POST api/users
// @desc     Register user
// @access   Public

router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists

      let user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
        email,
      ]);

      if (user.rows.length) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // Encrypt Passwprd

      const salt = await bcrypt.genSalt(10);
      if (!salt) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Something went wrong with bcrypt' }] });
      }

      const hash = await bcrypt.hash(password, salt);
      if (!hash) {
        return res.status(400).json({
          errors: [{ msg: 'Something went wrong hashing the password' }],
        });
      }

      // save User

      const newUser = await pool.query(
        'INSERT INTO users (user_name, user_email, user_password, user_avatar) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hash, avatar]
      );

      // return jsonwebtoken

      jwt.sign(
        { user: { id: newUser.rows[0].user_id } },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).json({ errors: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
