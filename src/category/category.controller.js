'use strict';
const express = require('express'),
  router = express.Router(),
  schema = require('./schema'),
  categoryService = require('./category.service'),
  logger = require('../lib/logger'),
  expressJoi = require('../helpers/joiValidation');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - category
 *     description: Returns all categories and subcategories
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: A list of categories & subcategories
 *       404:
 *         description: "No records found"
 *         schema:
 *           definitions:
 *             categories:
 *               properties:
 *                 Name:
 *                   type: string
 *                   required: true
 *                 Id:
 *                   type: integer
 *                   required: true
 *                 parentId:
 *                   type: integer
 */
router.get(
  '/',
  expressJoi.joiValidate(schema.getCategoriesInputParams),
  async (req, res, next) => {
    try {
      const data = await categoryService.getCategoryTree(req.query.id);
      res.send({ data, responseCode: 200 });
    } catch (error) {
      logger.error('Error in processing get category', e);
      next(error);
    }
  }
);

module.exports = router;
