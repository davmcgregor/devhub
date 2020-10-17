const db = require('./database/dbconfig')

const getUserByToken = id => {
  return db.query(
    'SELECT u.id, name, email, avatar, registered_at FROM users u WHERE id = $1',
    [id]
  )
}

const getUser = email => {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
}

const createNewUser = (name, email, hash, avatar) => {
  return db.query(
    'INSERT INTO users (name, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hash, avatar]
  )
}

const getUserProfile = id => {
  return db.query(
    'SELECT u.id, name, avatar, p.* FROM users u INNER JOIN profiles p ON (p.user_id = u.id) WHERE u.id = $1',
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
    'INSERT INTO profiles (user_id, company, website, location, status, skills, bio, githubusername, social) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (user_id) DO UPDATE SET company = $2, website = $3, location = $4, status = $5, skills = $6, bio = $7, githubusername = $8, social = $9 RETURNING *',
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
    'SELECT u.id, u.name, u.avatar, p.*, exp.*, edu.* FROM users u INNER JOIN profiles p ON p.user_id = u.id LEFT JOIN LATERAL (SELECT json_agg(exp) as experience from experiences exp WHERE exp.user_id = u.id) exp ON TRUE LEFT JOIN LATERAL (SELECT json_agg(edu) as education from educations edu WHERE edu.user_id = u.id) edu ON TRUE'
  )
}

const getProfileByUserId = id => {
  return db.query(
    'SELECT u.id, u.name, u.avatar, p.*, exp.*, edu.* FROM users u INNER JOIN profiles p ON p.user_id = u.id LEFT JOIN LATERAL (SELECT json_agg(exp) as experience from experiences exp WHERE exp.user_id = u.id) exp ON TRUE LEFT JOIN LATERAL (SELECT json_agg(edu) as education from educations edu WHERE edu.user_id = u.id) edu ON TRUE WHERE u.id = $1',
    [id]
  )
}

const getProfileByProfileId = id => {
  return db.query(
    'SELECT u.id, u.name, u.avatar, p.*, exp.*, edu.* FROM users u INNER JOIN profiles p ON p.user_id = u.id LEFT JOIN LATERAL (SELECT json_agg(exp) as experience from experiences exp WHERE exp.user_id = u.id) exp ON TRUE LEFT JOIN LATERAL (SELECT json_agg(edu) as education from educations edu WHERE edu.user_id = u.id) edu ON TRUE WHERE p.id = $1',
    [id]
  )
}

const deleteUser = id => {
  return db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
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
    'INSERT INTO experiences (user_id, title, company, location, exp_from, exp_to, current, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, title, company, location, from, to, current, description]
  )
}

const deleteExperience = id => {
  return db.query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id])
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
    'INSERT INTO educations (user_id, school, degree, fieldofstudy, edu_from, edu_to, current, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, school, degree, fieldofstudy, from, to, current, description]
  )
}

const deleteEducation = id => {
  return db.query('DELETE FROM educations WHERE id = $1 RETURNING *', [id])
}

const createPost = (id, text) => {
  return db.query(
    'INSERT INTO posts (user_id, text, avatar, name) VALUES ($1, $2, (SELECT avatar FROM users WHERE id = $1), (SELECT name FROM users WHERE id = $1)) RETURNING *',
    [id, text]
  )
}

const getAllPosts = () => {
  return db.query(
    "SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT coalesce(json_agg(l), '[]'::json) as likes FROM likes l WHERE l.post_id = p.id) l ON TRUE LEFT JOIN LATERAL (SELECT coalesce(json_agg(c), '[]'::json) AS comments FROM comments c WHERE c.post_id = p.id) c on TRUE ORDER BY p.created_at DESC"
  )
}

const getPost = id => {
  return db.query(
    "SELECT p.*, l.*, c.* FROM posts p LEFT JOIN LATERAL (SELECT coalesce(json_agg(l), '[]'::json) as likes FROM likes l WHERE l.post_id = p.id) l ON TRUE LEFT JOIN LATERAL (SELECT coalesce(json_agg(c), '[]'::json) AS comments FROM comments c WHERE c.post_id = p.id) c on TRUE WHERE p.id = $1",
    [id]
  )
}

const checkPost = id => {
  return db.query('SELECT * FROM posts WHERE id = $1', [id])
}

const deletePost = (id, user_id) => {
  return db.query(
    'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, user_id]
  )
}

const checkLike = (post_id, user_id) => {
  return db.query('SELECT * FROM likes WHERE post_id = $1 AND user_id = $2', [
    post_id,
    user_id
  ])
}

const createLike = (post_id, user_id) => {
  return db.query(
    'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *',
    [post_id, user_id]
  )
}

const deleteLike = (post_id, user_id) => {
  return db.query(
    'DELETE FROM likes WHERE post_id = $1 and user_id = $2 RETURNING *',
    [post_id, user_id]
  )
}

const allLikes = post_id => {
  return db.query(
    "SELECT coalesce(json_agg(l.*), '[]'::json) from (SELECT * FROM likes where post_id = $1) l",
    [post_id]
  )
}

const createComment = (user_id, post_id, text) => {
  return db.query(
    'INSERT INTO comments(user_id, post_id, text, avatar, name) VALUES ($1, $2, $3, (SELECT avatar FROM users WHERE id = $1), (SELECT name FROM users WHERE id = $1)) RETURNING *',
    [user_id, post_id, text]
  )
}

const checkComment = id => {
  return db.query('SELECT * FROM comments WHERE id = $1', [id])
}

const deleteComment = (id, user_id) => {
  return db.query(
    'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, user_id]
  )
}

const allComments = post_id => {
  return db.query(
    "SELECT coalesce(json_agg(c.*), '[]'::json) from (SELECT * FROM comments where post_id = $1) c",
    [post_id]
  )
}

module.exports = {
  getUserByToken,
  getUser,
  createNewUser,
  getUserProfile,
  createProfile,
  getAllProfiles,
  getProfileByUserId,
  getProfileByProfileId,
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
  allLikes,
  createComment,
  checkComment,
  deleteComment,
  allComments
}
