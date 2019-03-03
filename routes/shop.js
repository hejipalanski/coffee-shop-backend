'use-strict'

const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');

router.post('/shops', shopController.create);
router.get('/shops/:id', shopController.retrieveById);
router.get('/shops', shopController.retrieveAll);
router.patch('/shops/:id', shopController.updateById);
router.delete('/shops/:id', shopController.deleteById);

module.exports = router;
