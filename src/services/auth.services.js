const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/hash');
const { findUserByEmail, createUser, updateLastLoggedIn,  } = require('../models/user.models');

const register = async ({ email, firstName, lastName, password }) => {
  const existing = await findUserByEmail(email);

  if (existing) throw new Error('Email already exists');

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, firstName, lastName, passwordHash });
  const token = generateToken(user);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User with email does not exist');

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new Error('Invalid password');

  await updateLastLoggedIn(user.id)

  const token = generateToken(user);

  return { user, token };
};

module.exports = { register, login };