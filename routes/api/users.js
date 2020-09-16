const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/', [ 
  body('user_name', 'Name is required').not().isEmpty(),
  body('user_email', 'Please include a valid email').isEmail(),
  body('user_password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body);
  res.send('User route');
});

module.exports = router;
