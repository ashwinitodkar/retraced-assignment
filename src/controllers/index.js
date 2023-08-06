'use strict';
const express = require('express'),
  router = express.Router();

/**
 * @swagger
 * tags:
 * - name: "category"
 *   description: "Endpoints for category"
 */
router.use('/categories', require('./category'));

module.exports = router;
