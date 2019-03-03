'use-strict'

const express = require('express');
const router = express();
const coffeeController = require('../controller/coffeeController');

router.post('/shops/:shopId/drinks', coffeeController.create);
router.get('/shops/:shopId/drinks/:id', coffeeController.retrieveById);
router.get('/shops/:shopId/drinks', coffeeController.retrieveAll);
router.patch('/shops/:shopId/drinks/:id', coffeeController.updateById);
router.delete('/shops/:shopId/drinks/:id', coffeeController.deleteById);

module.exports = router;
