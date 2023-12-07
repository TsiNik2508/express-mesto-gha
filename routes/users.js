const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
} = require('../controllers/users');
const { validateSignup, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validate');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.post('/', validateSignup, createUser);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
router.get('/me', getUserInfo);

module.exports = router;
