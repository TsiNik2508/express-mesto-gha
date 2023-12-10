const userRoute = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateUpdateUser,
  validateAvatarUpdate,
  validateUserId,
} = require('../middlewares/validate');

userRoute.get('/', getAllUsers);
userRoute.get('/me', getCurrentUser);
userRoute.get('/:userId', validateUserId, getUserById);
userRoute.patch('/me', validateUpdateUser, updateProfile);
userRoute.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = userRoute;
