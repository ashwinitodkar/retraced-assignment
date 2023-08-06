'use strict';
const express = require('express'),
  router = express.Router(),
  schema = require('./schema'),
  category = require('./category'),
  logger = require('../../lib/logger');

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
  global.expressJoi.joiValidate(schema.getCategoriesInputParams),
  (req, res, next) => {
    category
      .getCategories(req.query.id)
      .then((data) => {
        logger.info(
          `find-categories-and-subcategories-${req.query.id}-result-${data}`
        );
        if (data) {
          return res.status(200).json({
            responseCode: 200,
            data: data[0],
          });
        }
        return res.status(404).json({
          responseCode: 404,
          responseDesc: global.config.default_not_found_message,
        });
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = router;
