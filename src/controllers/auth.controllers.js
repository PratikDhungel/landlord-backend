const authService = require('../services/auth.services');

const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ ...user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { register, login };