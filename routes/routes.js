const express = require('express');
const router = require('express').Router();
const userRoute = require('./users');
const cardRoute = require('./cards');
const Status = require('../error/Status');

router.use('/users', userRoute);
router.use('/cards', cardRoute);
router.use((req, res, next) => {
  next(new Status('Такая страница не существует'));
});
router.use(express.json());

module.exports = router;
