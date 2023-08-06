const expressJoi = require('../helpers/joiValidation');

exports.getCategoriesInputParams = {
  id: expressJoi.Joi.number(),
};
