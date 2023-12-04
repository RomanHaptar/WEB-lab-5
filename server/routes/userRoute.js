const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  deleteUser,
  updateUser,
  getUsers,
  createAdmin,
  promoteToAdmin,
} = require('../controllers/userController');
const { protect } = require('../middleware/authentication');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.delete('/:id', protect, deleteUser);
router.put('/:id', protect, updateUser);
router.get('/', protect, getUsers);
router.put('/setadm/:id', protect, promoteToAdmin);
router.get('/admin', createAdmin);

module.exports = router;
