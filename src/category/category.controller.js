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
      //if (data && data.length) {
      return res.send({
        data,
        responseCode: global.config.default_success_http_code,
      });
      //}
      // return res.status(global.config.default_not_found_http_code).send({
      //   responseCode: global.config.default_not_found_http_code,
      //   responseDesc: global.config.default_not_found_message,
      // });
    } catch (error) {
      logger.error('Error in processing get category', error);
      next(error);
    }
  }
);

module.exports = router;
