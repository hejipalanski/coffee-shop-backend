'use-strict'

const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');

router.post('/shops', shopController.create);
router.post('/shops/bulk', shopController.createBulk);
router.get('/shops/:id', shopController.retrieveById);
router.post('/shops/:shopId/menu', shopController.createMenuItem);
router.get('/shops/:shopId/menu', shopController.retrieveMenu);
router.get('/shops', shopController.retrieveAll);
router.patch('/shops/:id', shopController.updateById);
router.delete('/shops/:id', shopController.deleteById);

module.exports = router;
