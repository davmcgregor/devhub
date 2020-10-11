const db = require('./database/dbconfig')

const getUserByToken = id => {
  return db.query(
    'SELECT user_id, user_name, user_email, user_avatar, registered_at FROM users WHERE user_id = $1',
    [id]
  )
}

const getUser = email => {
  return db.query('SELECT * FROM users WHERE user_email = $1', [email])
}

const createNewUser = (name, email, hash, avatar) => {
  return db.query(
    'INSERT INTO users (user_name, user_email, user_password, user_avatar) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hash, avatar]
  )
}

const getUserProfile = id => {
  return db.query(
    'SELECT user_id, user_name, user_avatar, p.* FROM users u INNER JOIN profiles p ON (p.profile_user_id = u.user_id) WHERE u.user_id = $1',
    [id]
  )
}

const createProfile = (
  id,
  company,
  website,
  location,
  status,
  skills,
  bio,
  githubusername,
  social
) => {
  return db.query(
    'INSERT INTO profiles (profile_user_id, company, website, location, status, skills, bio, githubusername, social) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (profile_user_id) DO UPDATE SET company = $2, website = $3, location = $4, status = $5, skills = $6, bio = $7, githubusername = $8, social = $9 RETURNING *',
    [
      id,
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      social
    ]
  )
}

const getAllProfiles = () => {
  return db.query(
    'SELECT u.user_id, u.user_name, u.user_avatar, p.*, exp.*, edu.* FROM users u INNER JOIN profiles p ON p.profile_user_id = u.user_id LEFT JOIN LATERAL (SELECT json_agg(exp) as experience from experiences exp WHERE exp.experience_user_id = u.user_id) exp ON TRUE LEFT JOIN LATERAL (SELECT json_agg(edu) as education from educations edu WHERE edu.education_user_id = u.user_id) edu ON TRUE'
  )
}

const getProfile = id => {
  return db.query(
    'SELECT u.user_id, u.user_name, u.user_avatar, p.*, exp.*, edu.* FROM users u INNER JOIN profiles p ON p.profile_user_id = u.user_id LEFT JOIN LATERAL (SELECT json_agg(exp) as experience from experiences exp WHERE exp.experience_user_id = u.user_id) exp ON TRUE LEFT JOIN LATERAL (SELECT json_agg(edu) as education from educations edu WHERE edu.education_user_id = u.user_id) edu ON TRUE WHERE u.user_id::text = $1',
    [id]
  )
}

const deleteUser = id => {
  return db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id])
}

const createNewExperience = (
  id,
  title,
  company,
  location,
  from,
  to,
  current,
  description
) => {
  return db.query(
    'INSERT INTO experiences (experience_user_id, experience_title, experience_company, experience_location, experience_from, experence_to, experience_current, experience_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, title, company, location, from, to, current, description]
  )
}

const deleteExperience = id => {
  return db.query(
    'DELETE FROM experiences WHERE experience_id = $1 RETURNING *',
    [id]
  )
}

const createNewEducation = (
  id,
  school,
  degree,
  fieldofstudy,
  from,
  to,
  current,
  description
) => {
  return db.query(
    'INSERT INTO educations (education_user_id, education_school, education_degree, education_fieldofstudy, education_from, education_to, education_current, education_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, school, degree, fieldofstudy, from, to, current, description]
  )
}

const deleteEducation = id => {
  return db.query(
    'DELETE FROM educations WHERE education_id = $1 RETURNING *',
    [id]
  )
}

const createPost = (id, text) => {
  return db.query(
    'INSERT INTO posts (post_user_id, post_text, post_avatar) VALUES ($1, $2, (SELECT user_avatar FROM users WHERE user_id = $1)) RETURNING *',
    [id, text]
  )
}

const getAllPosts = () => {
  return db.query(
    'SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT json_agg(l) as likes FROM likes l WHERE l.like_post_id = p.post_id) l ON TRUE LEFT JOIN LATERAL (SELECT json_agg(c) AS comments FROM comments c WHERE c.comment_post_id = p.post_id) c on TRUE ORDER BY p.post_created_at DESC'
  )
}

const getPost = id => {
  return db.query(
    'SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT json_agg(l) as likes FROM likes l WHERE l.like_post_id = p.post_id) l ON TRUE LEFT JOIN LATERAL (SELECT json_agg(c) AS comments FROM comments c WHERE c.comment_post_id = p.post_id) c on TRUE WHERE p.post_id = $1',
    [id]
  )
}

const checkPost = id => {
  return db.query('SELECT * FROM posts WHERE post_id = $1', [id])
}

const deletePost = (post_id, user_id) => {
  return db.query(
    'DELETE FROM posts WHERE post_id = $1 AND post_user_id = $2 RETURNING *',
    [post_id, user_id]
  )
}

const checkLike = (post_id, user_id) => {
  return db.query(
    'SELECT * FROM likes WHERE like_post_id = $1 AND like_user_id = $2',
    [post_id, user_id]
  )
}

const createLike = (post_id, user_id) => {
  return db.query(
    'INSERT INTO likes (like_post_id, like_user_id) VALUES ($1, $2) RETURNING *',
    [post_id, user_id]
  )
}

const deleteLike = (post_id, user_id) => {
  return db.query(
    'DELETE FROM likes WHERE like_post_id = $1 and like_user_id = $2 RETURNING *',
    [post_id, user_id]
  )
}

const createComment = (user_id, post_id, text) => {
  return db.query(
    'INSERT INTO comments(comment_user_id, comment_post_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
    [user_id, post_id, text]
  )
}

const checkComment = id => {
  return db.query('SELECT * FROM comments WHERE comment_id = $1', [id])
}

const deleteComment = (comment_id, user_id) => {
  return db.query(
    'DELETE FROM comments WHERE comment_id = $1 AND comment_user_id = $2 RETURNING *',
    [comment_id, user_id]
  )
}

module.exports = {
  getUserByToken,
  getUser,
  createNewUser,
  getUserProfile,
  createProfile,
  getAllProfiles,
  getProfile,
  deleteUser,
  createNewExperience,
  deleteExperience,
  createNewEducation,
  deleteEducation,
  createPost,
  getAllPosts,
  getPost,
  checkPost,
  deletePost,
  checkLike,
  createLike,
  deleteLike,
  createComment,
  checkComment,
  deleteComment
}
