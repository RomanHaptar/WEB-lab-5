const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, fullname, group, idcard, birthdate, email } = req.body;

  if (!username || !password || !fullname || !group || !idcard || !birthdate || !email) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ where: { username } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    fullname,
    group,
    idcard,
    birthdate: convertDateFormat(birthdate),
    email,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      group: user.group,
      idcard: user.idcard,
      birthdate: user.birthdate,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user email
  const user = await User.findOne({ where: { username } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      group: user.group,
      idcard: user.idcard,
      birthdate: user.birthdate,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.destroy({ where: { id: req.params.id } });
  if (!user) {
    return res.status(400).json('User not found');
  }
  res.status(200).json('User deleted successfully');
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  // Check if user exists
  if (!user) {
    return res.status(400).json('User not found');
  }

  const { username, password, fullname, group, idcard, birthdate, email } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.update(
    { username, password: hashedPassword, fullname, group, idcard, birthdate: convertDateFormat(birthdate), email, },
    {
      where: { id: req.params.id },
    }
  );

  const updatedUser = await User.findByPk(req.user.id);

  if (updatedUser) {
    res.status(200).json({ ...updatedUser.get(), token: generateToken(req.user.id) });
  } else {
    res.status(400);
  }
});

// @desc    Get all users
// @route   GET /api/users/all
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Unauthorized');
  }
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('User is not an admin');
  }

  const users = await User.findAll();
  res.status(200).json(users);
});

// @desc    Create first user - admin
// @route   GET /api/users/admin
// @access  Public
const createAdmin = asyncHandler(async (req, res) => {
  const newuser = {
    username: 'admin_qwe123',
    password: 'adminQWERTY123*',
    fullname: 'Admin qwe123',
    group: 'SA-03',
    idcard: 'AB №123456',
    birthdate: convertDateFormat('01.01.2000'),
    email: 'admin@gmail.com',
    isAdmin: true,
  };

  // Check if user exists
  const userExists = await User.findOne({ where: { email: newuser.email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newuser.password, salt);

  // Create user
  const user = await User.create({
    ...newuser,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      group: user.group,
      idcard: user.idcard,
      birthdate: user.birthdate,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Set admin flag
// @route   PUT /api/users/setadm/:id
// @access  Public
const promoteToAdmin = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error('User is not an admin');
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const { username, password, fullname, group, idcard, birthdate, email } = user;
  await User.update(
    { username, password, fullname, group, idcard, birthdate: convertDateFormat(birthdate), email, isAdmin: true,},
    { where: { id: req.params.id },});

  const updatedUser = await User.findByPk(req.user.id);

  res.status(200).json({ ...updatedUser.get(), token: generateToken(req.user.id) });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

function convertDateFormat(date) {
  if (!date) {
    console.error('Date is undefined or null');
    return date;
  }
  
  const parts = date.split(".");
  
  if (parts.length !== 3) {
    console.error('Date format is incorrect');
    return date;
  }
  
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}


module.exports = {
  registerUser,
  loginUser,
  getMe,
  deleteUser,
  updateUser,
  getUsers,
  createAdmin,
  promoteToAdmin,
};
