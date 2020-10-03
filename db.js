const db = require('./database/dbconfig');

const getUserByToken = (id) => {
  return db.query(
    'SELECT user_id, user_name, user_email, user_avatar, registered_at FROM users WHERE user_id = $1',
    [id]
  );
};

const getUser = (email) => {
  return db.query('SELECT * FROM users WHERE user_email = $1', [email]);
};

const createNewUser = (name, email, hash, avatar) => {
  return db.query(
    'INSERT INTO users (user_name, user_email, user_password, user_avatar) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hash, avatar]
  );
};

const getUserProfile = (id) => {
  return db.query('SELECT user_id, user_name, user_avatar, p.* FROM users u INNER JOIN profiles p ON u.user_id = $1', [id]);
};

module.exports = {
  getUserByToken,
  getUser,
  createNewUser,
  getUserProfile
};
