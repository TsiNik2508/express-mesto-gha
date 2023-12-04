const router = require('express').Router();

const {
  getAllUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
