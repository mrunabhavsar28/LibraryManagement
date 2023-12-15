const jwt = require('jsonwebtoken');
const { ROLES } = require('../utils/constants');

const signUp = (req, res, users, config) => {
  const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one number.',
      });
    }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: ROLES.USER,
    lateReturnFine: 0,
  };

  users.push(newUser);

  const accessToken = jwt.sign({ id: newUser.id, role: newUser.role }, config.jwtSecret);
  res.json({ accessToken, role: newUser.role });
};

const signIn = (req, res, users, config) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret);
  res.json({ accessToken, role: user.role });
};

module.exports = { signUp, signIn };
