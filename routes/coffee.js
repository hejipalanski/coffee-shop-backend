'use-strict'

const express = require('express');
const router = express();
const coffeeController = require('../controller/coffeeController');

router.post('/coffees', coffeeController.create);
router.post('/coffees/bulk', coffeeController.createBulk);
router.get('/coffees:id', coffeeController.retrieveById);
router.get('/coffees', coffeeController.retrieveAll);
router.patch('/coffees/:id', coffeeController.updateById);
router.delete('/coffees/:id', coffeeController.deleteById);

module.exports = router;
