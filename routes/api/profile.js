require('dotenv').config()
const express = require('express')
const request = require('request')
const router = express.Router()
const auth = require('../../middleware/auth')
const { body, validationResult } = require('express-validator')

const db = require('../../db')

// @route GET api/profile/me
// @desc Get current users profile
// @access Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await db.getProfile(req.user.id)

    if (!profile.rows.length) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route POST api/profile
// @desc Create or update user profile
// @access Private

router.post(
  '/',
  [
    auth,
    [
      body('status', 'Status is required').not().isEmpty(),
      body('skills', 'Skills is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body

    // Build profile object

    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      const profile = await db.createProfile(
        req.user.id,
        profileFields.company,
        profileFields.website,
        profileFields.location,
        profileFields.status,
        profileFields.skills,
        profileFields.bio,
        profileFields.githubusername,
        profileFields.social
      )

      res.json(profile.rows[0])
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await db.getAllProfiles()
    res.json(profiles.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await db.getProfile(req.params.user_id)

    if (!profile.rows.length) {
      return res.status(400).json({ msg: 'Profile not found' })
    }

    res.json(profile.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    //Remove user, profile, comments & likes
    await db.deleteUser(req.user.id)

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route INSERT api/profile/experience
// @desc Add profile experience
// @access Private

router.post(
  '/experience',
  [
    auth,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('exp_from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      exp_from,
      exp_to,
      current,
      description
    } = req.body

    const experienceFields = {
      title,
      company,
      location,
      exp_from,
      exp_to,
      current,
      description
    }

    try {
      const experience = await db.createNewExperience(
        req.user.id,
        experienceFields.title,
        experienceFields.company,
        experienceFields.location,
        experienceFields.exp_from,
        experienceFields.exp_to,
        experienceFields.current,
        experienceFields.description
      )

      res.json(experience.rows[0])
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    await db.deleteExperience(req.params.exp_id)

    const updatedProfile = await db.getProfile(req.user.id)

    res.json(updatedProfile.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route INSERT api/profile/education
// @desc Add profile education
// @access Private

router.post(
  '/education',
  [
    auth,
    [
      body('school', 'School is required').not().isEmpty(),
      body('degree', 'Degree is required').not().isEmpty(),
      body('fieldofstudy', 'Field of study is required').not().isEmpty(),
      body('edu_from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      edu_from,
      edu_to,
      current,
      description
    } = req.body

    const educationFields = {
      school,
      degree,
      fieldofstudy,
      edu_from,
      edu_to,
      current,
      description
    }

    try {
      const education = await db.createNewEducation(
        req.user.id,
        educationFields.school,
        educationFields.degree,
        educationFields.fieldofstudy,
        educationFields.edu_from,
        educationFields.edu_to,
        educationFields.current,
        educationFields.description
      )

      res.json(education.rows[0])
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route DELETE api/profile/education/:edu_id
// @desc Delete profile education
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    await db.deleteEducation(req.params.edu_id)

    const updatedProfile = await db.getProfile(req.user.id)

    res.json(updatedProfile.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
