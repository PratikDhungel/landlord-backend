const db = require('../db/db');

const findUserByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const createUser = async ({ email, firstName, lastName, passwordHash }) => {
  const res = await db.query(
    `INSERT INTO users (email, first_name, last_name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, firstName, lastName, passwordHash]
  );
  return res.rows[0];
};

const updateLastLoggedIn = async (userId ) => {
  await db.query(
    `UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [userId]
  );
};

module.exports = {
  findUserByEmail,
  createUser,
  updateLastLoggedIn
};